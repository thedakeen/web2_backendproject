const {UserModel} = require('../models/userModel.js')
const bcrypt = require('bcrypt')

const passport = require('passport')


const jwt = require('jsonwebtoken')
const twilioClient = require('twilio')('AC07c924865f15adf1daec6017c31eebb1', 'a51055c81265c70e21126a0f8729fcac')


const {validationResult} = require('express-validator')
const loginForm = (req, res) => {
    let error = null
    if (typeof req.session.message !== 'undefined') {
        if (typeof req.session.message.loginError !== 'undefined' && req.session.message.loginError.length !== 0) {
            error = req.session.message.loginError
            delete req.session.message.loginError
        }
    }
    res.render('login_page', {
        title: 'Login Page',
        IsAuthorized: req.session.authorized,
        error: error,
    })
}

const login = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const mappedErrors = errors.mapped()
            return res.render('login_page', {
                title: 'Login Page',
                IsAuthorized: req.session.authorized,
                passwordError: mappedErrors.password,
                phoneError: mappedErrors.phone,
            })
        }

        const user = await UserModel.findOne({
            phone: req.body.phone,
        })

        if (!user) {
            res.render('login_page', {
                title: 'Login Page',
                IsAuthorized: req.session.authorized,
                error: 'Wrong login or password',
            })
            return
        }

        const isValidPass = await bcrypt.compare(
            req.body.password,
            user.passwordHash
        )

        if (!isValidPass) {
            res.render('login_page', {
                title: 'Login Page',
                IsAuthorized: req.session.authorized,
                error: 'Wrong login or password',
            })
            return
        }

        const token = jwt.sign({
            userId: user._id,
            role: user.role
        }, 'b1e7q9b3f4o6n0m5a9d3k4z7x2c5v8b0n1m2a3s4d5f6g7h8j9k0lqwe', {expiresIn: '1h'})
        res.cookie('authToken', token, {httpOnly: true, sameSite: 'lax', secure: false})


        req.session.authorized = true
        req.session.userId = user._id

        res.redirect('/')
    } catch (e) {
        res.status(500).json({
            message: 'Internal Server Error',
        })
    }
}

const registrationForm = (req, res) => {
    res.render('register_page', {
        title: 'Register Page',
        IsAuthorized: req.session.authorized,
    })
}

const registration = async (req, res) => {
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const mappedErrors = errors.mapped()
            return res.render('register_page', {
                title: 'Register Page',
                IsAuthorized: req.session.authorized,
                nameError: mappedErrors.name,
                passwordError: mappedErrors.password,
                phoneError: mappedErrors.phone,
            })
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHashed = await bcrypt.hash(req.body.password, salt)

        const doc = new UserModel({
            phone: req.body.phone,
            name: req.body.name,
            passwordHash: passwordHashed,
        })

        await doc.save()

        res.redirect('/user/login')
    } catch (e) {
        res.status(500).json({
            message: e,
        })
    }
}
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err)
            return res.status(500).send('Error logging out')
        }

        res.clearCookie('authToken')
        res.clearCookie('connect.sid')
        res.redirect('/user/login')
    })
}

const home = (req, res) => {
    let IsAuthorized = req.session.authorized
    if (!IsAuthorized) {
        IsAuthorized = false
    }
    res.render('home_page', {
        title: 'Home Page',
        IsAuthorized: IsAuthorized,
    })
}

const forgotPasswordForm = (req, res) => {
    res.render('recovery_page', {
        title: 'Password recovery',
        IsAuthorized: req.session.authorized,
    })
}

const sendOtp = async (req, res) => {
    const {phone} = req.body
    const user = await UserModel.findOne({phone: phone})
    if (!user) {
        return res.status(404).render('recovery_page', {
            error: 'No user with such phone number.',
        })
    }

    const otp = generateOtp()
    const expiresIn = new Date(new Date().getTime() + 30 * 60000)


    await UserModel.updateOne({phone}, {
        $set: {'otp.value': otp, 'otp.expiresIn': expiresIn}
    })

    console.log(phone)
    try {
        await twilioClient.messages.create({
            body: `Password recovery code: ${otp}`,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${phone}`
        })

        res.render('verify-otp_page', {
            title: 'Confirm OTP',
            phone: phone,
            IsAuthorized: req.session.authorized,
        })
    } catch (error) {
        console.error('Fail sending OTP:', error)
        res.status(500).render('recovery_page', {
            error: 'Please try again later.',
        })
    }
}

function generateOtp(length = 6) {
    let otp = ''
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10)
    }
    return otp
}


const verifyOtp = async (req, res) => {
    const {phone, otp} = req.body
    const user = await UserModel.findOne({
        phone: phone,
        'otp.value': otp,
        'otp.expiresIn': {$gt: new Date()}
    })

    if (!user) {
        return res.status(400).render('verify-otp_page', {
            error: 'Invalid OTP or it has expired.',
            title: 'Confirm OTP',
            phone: phone,
            IsAuthorized: req.session.authorized,
        })
    }

    res.render('change-password_page', {
        phone: phone,
        title: 'Change Password',
        IsAuthorized: req.session.authorized,
    })
}

// В вашем контроллере
const changePassword = async (req, res) => {
    const {phone, newPassword} = req.body
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(newPassword, salt)

    try {
        await UserModel.updateOne({phone}, {
            $set: {passwordHash: passwordHash},
            $unset: {otp: ''}
        })

        res.redirect('/user/login')
    } catch (error) {
        console.error('Error changing password:', error)
        res.status(500).send('An error occurred. Please try again later.')
    }
}


const loginWithFacebook = async (req, res) => {
    const {facebookId, name} = req.body
    try {
        const user = await UserModel.findOne({
            facebookID: facebookId
        })
        if (!user) {
            const doc = new UserModel({
                facebookID: facebookId,
                name: name,
            })

            await doc.save()
            const user = await UserModel.findOne({
                facebookID: facebookId
            })
            req.session.authorized = true
            const token = jwt.sign({userId: user._id}, 'b1e7q9b3f4o6n0m5a9d3k4z7x2c5v8b0n1m2a3s4d5f6g7h8j9k0lqwe', {expiresIn: '1h'})
            res.cookie('authToken', token, {httpOnly: true, sameSite: 'strict'})
            return res.redirect('/')
        } else {
            req.session.authorized = true
            const token = jwt.sign({userId: user._id}, 'b1e7q9b3f4o6n0m5a9d3k4z7x2c5v8b0n1m2a3s4d5f6g7h8j9k0lqwe', {expiresIn: '1h'})
            res.cookie('authToken', token, {httpOnly: true, sameSite: 'strict'})

            return res.redirect('/')
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal server error')
    }
}
module.exports = {
    loginForm,
    login,
    registrationForm,
    registration,
    logout,
    home,
    forgotPasswordForm,
    sendOtp,
    verifyOtp,
    changePassword,
    loginWithFacebook

}
