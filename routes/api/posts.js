const express = require("express");
const routes = express.Router();
const mongoose = require('mongoose');
const Post = require('../../models/Post');
const validatePostInput = require('../../middleware/validation/post');
const auth = require('../../middleware/auth');
const isIdValid = require('../../middleware/validation/isIdValid');

// @route   Get api/posts/test
// @desc    Test post routes
// @access  Public
routes.get("/test", (req, res) => res.json({ mssg: "posts works" }));


// @route   Get api/posts
// @desc    Gets all the post on db
// @access  Public
routes.get('/', async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    if (posts.length <= 0) return res.status(404).json({ post: "There is no post" });
    res.json(posts)
});

// @route   Get api/posts/:post_id
// @desc    Gets a specific post on db
// @access  Public
routes.get('/:post_id', isIdValid(["post_id"]), async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.post_id });
        if (!post) return res.status(404).json({ post: 'post not found' })
        return res.json(post);
    } catch (err) {
        console.log(err)
    }

});

// @route   Post api/posts
// @desc    Create new post
// @access  Private
routes.post('/', [auth, validatePostInput], async (req, res) => {
    try {
        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        })
        const post = await newPost.save();
        res.json(post)
    } catch (err) {
        console.log(err)
    }

});

// @route   Post api/posts/like/:post_id
// @desc    Like post
// @access  Private
routes.post('/like/:post_id', [auth, isIdValid(['post_id'])], async (req, res) => {
    try {
        let post = await Post.findById(req.params.post_id);
        //CHECK IF POST HAS ALREADT BEEN LIKED BY USER
        if (post.likes.filter(like => like.user?.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyliked: 'User already liked this post' })
        } else {
            // ADD USER ID TO LIKES ARRAY
            post.likes.unshift({ user: req.user.id });
            let newPost = await post.save();
            return res.json(newPost)
        }
    } catch (err) {
        console.log(err)
    }
})

// @route   Post api/posts/unlike/:post_id
// @desc    Unlike post
// @access  Private
routes.post('/unlike/:post_id', [auth, isIdValid(['post_id'])], async (req, res) => {
    try {
        let post = await Post.findById(req.params.post_id);
        //CHECK IF POST HAS ALREADT BEEN LIKED BY USER
        if (post.likes.filter(like => like.user?.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notliked: 'You have not liked this post' })
        } else {
            // REMOVE USER ID TO LIKES ARRAY
            post.likes = post.likes.filter(like => like.user?.toString() !== req.user.id);

            // SAVE POST
            let updatedPost = await post.save();
            return res.json(updatedPost);
        }
    } catch (err) {
        console.log(err)
    }
});

// @route   Post api/posts/comment/:post_id
// @desc    Add comment to post
// @access  Private
routes.post('/comment/:post_id', [auth, isIdValid(['post_id']), validatePostInput], async (req, res) => {
    try {
        let post = await Post.findById(req.params.post_id);
        let newComment = {
            user: req.user.id,
            text: req.body.text,
            name: req.user.name,
            avatar: req.user.avatar
        }
        post.comments.unshift(newComment);
        let updatedPost = await post.save();
        return res.json(updatedPost);
    } catch (err) {
        console.log(err);
    }
});

// @route   Delete api/posts/comment/:post_id/:comment_id
// @desc    Remove comment in post
// @access  Private
routes.delete('/comment/:post_id/:comment_id', [auth, isIdValid(['post_id', 'comment_id'])], async (req, res) => {
    try {
        let post = await Post.findById(req.params.post_id);
        // CHECK IF COMMENT EXIST
        if (post.comments.filter(comment => comment.id === req.params.comment_id).length === 0) {
            return res.status(404).json({ commentnotexist: 'Comment does not exist' })
        }
        // CHECK IF USER MADE THE COMMENT
        if (post.comments.filter(comment => comment.user?.toString() === req.user.id).length === 0) {
            return res.status(401).json({ deletecomment: `you can't remove a comment you didn't make` })
        }

        // REMOVE LOGGED IN USER COMMENT FROM POST
        post.comments = post.comments.filter(comment => comment.id !== req.params.comment_id);

        // SAVE POST
        let updatedPost = await post.save();
        return res.json(updatedPost)
    } catch (err) {
        console.log(err);
    }
});

// @route   Delete api/posts/:post_id/
// @desc    Delete specific post
// @access  Private
routes.delete('/:post_id', [auth, isIdValid(['post_id'])], async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        // CHECK IF LOGGED IN USER IS THE POST OWNER
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: "User not authorized" })
        } else {
            //DELETE
            await post.remove()
            res.json({ success: true })
        }

    } catch (err) {
        console.log(err);
        return res.status(401).json({ nopostfound: "No post found" });
    }
})

module.exports = routes