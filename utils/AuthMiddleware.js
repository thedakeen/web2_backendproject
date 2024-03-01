const jwt = require('jsonwebtoken')


const authorizationCheck = (req, res, next) => {
    if (!req.session.authorized) {
        req.session.message = {
            loginError: 'You need to Log In'
        }
        return res.redirect('/user/login')
    }

    next()
}

const refuse = (req, res, next) => {
    if (req.session.authorized) {
        return res.redirect('/')
    }

    next()
}

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken
    console.log('Received authToken:', token)
    if (!token) {
        return res.status(403).send('A token is required for authentication')
    }
    try {
        const decoded = jwt.verify(token, 'b1e7q9b3f4o6n0m5a9d3k4z7x2c5v8b0n1m2a3s4d5f6g7h8j9k0lqwe')
        req.user = decoded
    } catch (err) {
        return res.status(401).send('Invalid Token')
    }
    next()
}

function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).send('Access denied. You are not admin')
    }
}

function isAdminOrManager(req, res, next) {
    console.log(req.user)

    if ((req.user && req.user.role === 'admin') || (req.user && req.user.role === 'manager')) {
        next()
    } else {
        res.status(403).send('Access denied')
    }
}


module.exports = {
    authorizationCheck,
    refuse,
    verifyToken,
    isAdmin,
    isAdminOrManager
}