const {body} = require('express-validator')

const registerValidator = [
    body('phone', 'Invalid phone number').isMobilePhone(),
    body('password', 'Minimum 5 symbols').isLength({min: 5}),
    body('name', 'Minimum 3 symbols').isLength({min: 3}),
]

const loginValidator = [
    body('phone', 'Invalid phone number').isMobilePhone(),
    body('password', 'Empty line').isLength({min: 1}),
]

module.exports = {
    registerValidator,
    loginValidator,
}
