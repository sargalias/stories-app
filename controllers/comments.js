const Comment = require('../models/Comment');
const Story = require('../models/Story');
const User = require('../models/User');
const {commentValidation} = require('../helpers/commentValidation');
const {validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');
const async = require('async');

function createComment(req, res, next) {
    const errors = validationResult(req);
    const commentData = matchedData(req, {locations: ['body']});
    if (!errors.isEmpty()) {
        for (let error of (errors.array())) {
            req.flash('alert', error.msg);
        }
        return res.redirect('back');
    }
    console.log(commentData);
    const comment = new Comment({
        storyId: req.params.story_id,
        body: commentData.commentText,
        author: req.user,
    });
    req.user.comments.push(comment);
    Story.findById(req.params.story_id, (err, story) => {
        if (err) {
            return next(err);
        }
        else if (!story) {
            let err = new Error('Story not found');
            err.statusCode = 404;
            return next(err);
        }
        story.comments.push(comment);
        async.parallel([
            function (callback) {
                story.save(callback);
            },
            function (callback) {
                comment.save(callback);
            },
            function(callback) {
                req.user.save(callback);
            }
        ], function(err, results) {
            if (err) {
                return next(err);
            }
            res.redirect('back');
        });
    });
}

module.exports.create = [commentValidation, createComment];
