const mongoose = require('mongoose')

// VERIFY IF ID PASSED AS PARAMS IS A VALID MONGOOSE OBJECTID
module.exports = function (array) {
    return (req, res, next) => {
        for (let i = 0; i < array.length; i++) {
            const prefix = array[i];
            if (!mongoose.Types.ObjectId.isValid(req.params[prefix])) {
                i = array.length + 1
                return res.status(404).json(`INVALID ${prefix} ID PASSED`)
            }
        }
        return next();
    }
}