const express = require("express");
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const routes = express.Router();
const auth = require('../../middleware/auth');
const validateProfileInput = require('../../middleware/validation/profile');
const validateExperienceInput = require('../../middleware/validation/experience');
const validateEducationInput = require('../../middleware/validation/education');
const isIdValid = require('../../middleware/validation/isIdValid');


// @route   Get api/profile/test
// @desc    Test profile routes
// @access  Public
routes.get("/test", (req, res) => res.json({ mssg: "profile works" }));

// @route   Get api/profile
// @desc    Get current user profile
// @access  Private
routes.get('/', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name avatar');
        if (!profile) return res.status(404).json({ noProfile: 'There is no profile for this user' })
        else return res.status(200).json(profile);
    } catch (err) {
        res.status(404).json(err)
    }
});

// @route   Get api/profile/user/user_id
// @desc    Get a user profile by their user ID
// @access  Public
routes.get('/user/:user_id', isIdValid(["user_id"]), async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.params.user_id }).populate('user', 'name avatar');
        if (!profile) return res.status(404).json({ noProfile: 'There is no file for this user' })
        else return res.json(profile);
    } catch (err) {
        console.log(err)
        res.status(404).json({ profile: "INVALID USER ID PASSED" });
    }
})

// @route   Get api/profile/handle/:handle
// @desc    Get a user profile by their handle
// @access  Public
routes.get('/handle/:handle', async (req, res) => {
    try {
        let profile = await Profile.findOne({ handle: req.params.handle }).populate('user', 'name avatar');
        if (!profile) return res.status(404).json({ noProfile: 'There is no file for this user' })
        else return res.json(profile);
    } catch (err) {
        res.status(404).json(err)
    }
})
// @route   Get api/profile/all
// @desc    Get all profiles on the db
// @access  Public
routes.get('/all', async (req, res) => {
    try {
        let profiles = await Profile.find().populate('user', 'name avatar');
        if (!profiles) return res.status(404).json({ profile: "There is no profile on the db" })
        else return res.json(profiles)
    } catch (err) {
        res.status(404).json({ profile: "There is no profile on the db" })
    }
});

// @route   Post api/profile/experience
// @desc    Add job experience to profile
// @access  Private
routes.post('/experience', [auth, validateExperienceInput], async (req, res) => {
    let profile = await Profile.findOne({ user: req.user.id });
    const newExp = {
        tittle: req.body.tittle,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
    }
    // ADD NEWEXP TO PROFILE
    profile.experience.unshift(newExp)
    let updatedProfile = await profile.save();
    res.json(updatedProfile);
})

// @route   Post api/profile/education
// @desc    Add education to profile
// @access  Private
routes.post('/education', [auth, validateEducationInput], async (req, res) => {
    let profile = await Profile.findOne({ user: req.user.id });
    const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
    }
    // ADD NEWEDU TO PROFILE
    profile.education.unshift(newEdu)
    let updatedProfile = await profile.save();
    res.json(updatedProfile);
})

// @route   Post api/profile
// @desc    Create & edit user profile
// @access  Private
routes.post('/', [auth, validateProfileInput], async (req, res) => {
    let errors = {}
    let profileFields = {}
    profileFields.user = req.user.id
    profileFields.social = {}
    if (req.body.handle) profileFields.handle = req.body.handle
    if (req.body.company) profileFields.company = req.body.company
    if (req.body.website) profileFields.website = req.body.website
    if (req.body.location) profileFields.location = req.body.location
    if (req.body.status) profileFields.status = req.body.status
    if (typeof req.body.skills !== 'undefined') profileFields.skills = req.body.skills.split(',')
    if (req.body.bio) profileFields.bio = req.body.bio
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter
    if (req.body.date) profileFields.date = req.body.date

    let profile = await Profile.findOne({ user: req.user.id })
    if (profile) {
        //UPDATE EXISTING PROFILE
        let updatedProfile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
        res.json(updatedProfile)
    } else {
        //CREATE NEW PROFILE

        //CHECK IF HANDLE AREADY EXIST
        let profile = await Profile.findOne({ handle: req.body.handle });
        if (profile) {
            // DON'T SAVE
            errors.handle = 'That handle already exist'
            res.status(400).json(errors)
        } else {
            //SAVE
            let profile = await new Profile(profileFields).save();
            res.json(profile)
        }
    }

})

// @route   Delete api/profile/experience
// @desc    Delete job experience on profile
// @access  Private
routes.delete('/experience/:exp_id', [auth, isIdValid(["exp_id"])], async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ profile: "Profile not found" })
        // DELETE EXPERIENCE
        profile.experience = profile.experience.filter(item => item.id !== req.params.exp_id);

        //SAVE PROFILE
        let updatedProfile = await profile.save();
        res.json(updatedProfile)
    } catch (err) {
        res.status(400).json(err)
    }

})

// @route   Delete api/profile/education
// @desc    Delete education info on profile
// @access  Private
routes.delete('/education/:edu_id', [auth, isIdValid(["edu_id"])], async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ profile: "Profile not found" })
        // DELETE education
        profile.education = profile.education.filter(item => item.id !== req.params.edu_id);

        //SAVE profile
        let updatedProfile = await profile.save();
        res.json(updatedProfile)
    } catch (err) {
        res.status(400).json(err)
    }

})

// @route   Delete api/profile
// @desc    Delete user and profile
// @access  Private
routes.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ success: true })

    } catch (err) {
        res.status(400).json(err)
    }

})

module.exports = routes