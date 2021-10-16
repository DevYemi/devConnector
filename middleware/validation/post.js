const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validatePostInput(req, res, next) {
    let data = req.body
    let errors = {}
    let isValid;

    data.text = !isEmpty(data.text) ? data.text : ''



    if (Validator.isEmpty(data.text)) errors.text = 'Text field is required'
    else if (!Validator.isLength(data.text, { min: 3, max: 300 })) errors.text = "Text field but be at between 3 and 300 characters long"

    isValid = isEmpty(errors)
    if (!isValid) return res.status(400).json(errors);
    else next();
}