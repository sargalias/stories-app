const Comment = require('../models/Comment');
const Story = require('../models/Story');
const User = require('../models/User');
const {commentValidation} = require('../helpers/commentValidation');
const {validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');
const async = require('async');

function commentErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        for (let error of (errors.array())) {
            req.flash('alert', error.msg);
        }
        return res.redirect('back');
    } else {
        return next();
    }
}

function replaceComment(collection, comment) {
    collection.id(comment._id).remove();
    collection.push(comment);
}

function saveCollections(comment, story, user, req, res, next) {
    async.parallel([
        function (callback) {
            comment.save(callback);
        },
        function (callback) {
            story.save(callback);
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
}

function createComment(req, res, next) {
    const commentData = matchedData(req, {locations: ['body']});
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
        saveCollections(comment, story, req.user, req, res, next);
    });
}

module.exports.create = [commentValidation, commentErrors, createComment];

function updateComment(req, res, next) {
    const commentData = matchedData(req, {locations: ['body']});
    async.parallel({
        story: function(callback) {
            Story.findById(req.params.story_id, callback);
        },
        comment: function(callback) {
            Comment.findById(req.params.comment_id, (callback));
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        } else if (!results.comment) {
            let err = new Error('Comment not found');
            err.statusCode = 404;
            return next(err);
        } else if (!results.story) {
            let err = new Error('Story not found');
            err.statusCode = 404;
            return next(err);
        }
        results.comment.body = commentData.commentText;
        replaceComment(req.user.comments, results.comment);
        replaceComment(results.story.comments, results.comment);
        saveCollections(results.comment, results.story, req.user, req, res, next);
    });
}

module.exports.update = [commentValidation, commentErrors, updateComment];

