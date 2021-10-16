const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateLoginInput(req, res, next) {
    let data = req.body
    let errors = {}
    let isValid;

    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''


    if (Validator.isEmpty(data.email)) errors.email = 'Email field is required'
    else if (!Validator.isEmail(data.email)) errors.email = 'Email is invalid'
    if (Validator.isEmpty(data.password)) errors.password = 'Password field is required'
    else if (!Validator.isLength(data.password, { min: 6, max: 30 })) errors.password = 'Password must be at least 6 characters'


    isValid = isEmpty(errors)
    if (!isValid) return res.status(400).json(errors);
    else next();
}