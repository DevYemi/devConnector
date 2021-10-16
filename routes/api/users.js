const express = require("express");
const routes = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./../../config/keys");
const validateRegisterInput = require('../../middleware/validation/register');
const validateLoginInput = require('../../middleware/validation/login');
const auth = require('../../middleware/auth')

// @route   Get api/users/test
// @desc    Test users routes
// @access  Public
routes.get("/test", (req, res) => res.json({ mssg: "user works" }));

// @route   Get api/users/register
// @desc    Register new user
// @access  Public
routes.post("/register", validateRegisterInput, async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.name }); // checks if email has been registerted before
        if (user) {
            return res.status(400).json({ email: "email already exist" })
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: "200",
                r: "pg",
                d: "mm"
            })
            const newUser = new User({ // create a new user with the User class from User model
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar,

            })
            const salt = await bcrypt.genSalt(10); // create bcrypt salt
            const hash = await bcrypt.hash(newUser.password, salt); // hash passoword with bcrypt salt
            newUser.password = hash;
            const user = await newUser.save(); // save new user on db
            res.json({ user })
        }
    } catch (err) {
        console.log(err);
    }
})

// @route   Get api/users/login
// @desc    Login user
// @access  Public
routes.post("/login", validateLoginInput, async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        //CHECK IF USER EXIST ON DB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ email: "User not found" });
        }

        //CHECK IF PASSWORD IS CORRECT
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ password: "Invalid password" })
        }

        // CREATE JSON WEB TOKEN
        const payload = { id: user._id, name: user.name, avatar: user.avatar };
        const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 86400 });
        res.header('x-auth-token', token).json({ sucess: true, token: token });
    } catch (err) {
        console.log(err)
    }
});

// @route   Get api/users/current
// @desc    Return current user
// @access  Private
routes.get("/current", auth, (req, res) => {
    res.json(req.user)
})
module.exports = routes