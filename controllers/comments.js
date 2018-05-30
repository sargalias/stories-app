const Comment = require('../models/Comment');
const Story = require('../models/Story');
const {commentValidation} = require('../helpers/commentValidation');
const {matchedData} = require('express-validator/filter');
const async = require('async');
const mongoose = require('mongoose');
const cch = commentsControllerHelper = require('../helpers/commentsControllerHelper');

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
        cch.saveCollectionsAndRedirect([comment, story, req.user], 'back', req, res, next);
    });
}

module.exports.create = [commentValidation, cch.handleCommentErrors, createComment];

function updateComment(req, res, next) {
    const commentData = matchedData(req, {locations: ['body']});
    async.parallel({
        story: function(callback) {
            Story.findById(req.params.story_id, callback);
        },
        comment: function(callback) {
            Comment.findById(req.params.comment_id, (callback));
        },
    }, function(err, results) {
        let updatedComment = results.comment;
        let story = results.story;
        if (err) {
            return next(err);
        } else if (!updatedComment) {
            let err = new Error('Comment not found');
            err.statusCode = 404;
            return next(err);
        } else if (!story) {
            let err = new Error('Story not found');
            err.statusCode = 404;
            return next(err);
        }

        // Update comment with new body
        cch.updateCommentWithNewCommentBody(updatedComment, commentData.commentText);
        cch.updateCommentsArrayWithUpdatedComment(story.comments, updatedComment);
        cch.saveCollectionsAndRedirect([updatedComment, story], 'back', req, res, next);
    });
}

module.exports.update = [commentValidation, cch.handleCommentErrors, updateComment];

module.exports.delete = (req, res, next) => {
    async.parallel([
        function(callback) {
            Comment.findByIdAndRemove(req.params.comment_id, callback);
        },
        function(callback) {
            Story.findById(req.params.story_id, (err, story) => {
                if (err) {
                    return callback(err);
                }
                story.comments.id(mongoose.Types.ObjectId(req.params.comment_id)).remove();
                story.save(callback);
            });
        },
        function(callback) {
            cch.removeCommentReferenceFromArr(req.user.comments, req.params.comment_id);
            req.user.save(callback);
        }
    ], function(err, results) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Comment deleted');
        res.redirect('back');
    });
};
