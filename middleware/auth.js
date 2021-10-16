const jwt = require('jsonwebtoken');
const keys = require("../config/keys");

module.exports = function (req, res, next) {
    let token = req.header('x-auth-token');
    if (!token) return res.status(401).json("ACCESS NOT GRANTED");

    try {
        let decoded = jwt.verify(token, keys.secretOrKey);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json(err.name)
    }
}