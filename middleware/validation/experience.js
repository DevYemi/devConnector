const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateExperienceInput(req, res, next) {
    let data = req.body
    let errors = {}
    let isValid;

    data.tittle = !isEmpty(data.tittle) ? data.tittle : ''
    data.company = !isEmpty(data.company) ? data.company : ''
    data.from = !isEmpty(data.from) ? data.from : ''


    if (Validator.isEmpty(data.tittle)) errors.tittle = ' Job Tittle field is required'

    if (Validator.isEmpty(data.company)) errors.company = 'Company name field is required'

    if (Validator.isEmpty(data.from)) errors.from = 'From field is required'



    isValid = isEmpty(errors)
    if (!isValid) return res.status(400).json(errors);
    else next();
}