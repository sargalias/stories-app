const Comment = require('../models/Comment');
const Story = require('../models/Story');
const {commentValidation} = require('../helpers/commentValidation');
const {validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');
const async = require('async');
const mongoose = require('mongoose');

function handleCommentErrors(req, res, next) {
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

function updateCommentsArrayWithUpdatedComment(subdocArray, updatedComment) {
    for (let i=0; i<subdocArray.length; i++) {
        if (subdocArray[i]._id.equals(updatedComment.id)) {
            updateCommentWithNewCommentBody(subdocArray[i], updatedComment.body);
        }
    }
}

function updateCommentWithNewCommentBody(comment, newCommentBody) {
    comment.body = newCommentBody;
}

function saveCollection(collection) {
    return function (cb) {
        collection.save(cb);
    }
}

function saveCollections(collections, req, res, next) {
    let asyncFunctionsArray = [];
    collections.forEach((collection) => {
        asyncFunctionsArray.push(saveCollection(collection));
    });
    async.parallel(
        asyncFunctionsArray,
        function(err, results) {
            if (err) {
                return next(err);
            }
            res.redirect('back');
        }
    );
}

function removeCommentReferenceFromArr(arr, referenceId) {
    let i = arr.indexOf(referenceId);
    arr.splice(i, 1);
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
        saveCollections([comment, story, req.user], req, res, next);
    });
}

module.exports.create = [commentValidation, handleCommentErrors, createComment];

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
        updateCommentWithNewCommentBody(updatedComment, commentData.commentText);
        updateCommentsArrayWithUpdatedComment(story.comments, updatedComment);
        saveCollections([updatedComment, story], req, res, next);
    });
}

module.exports.update = [commentValidation, handleCommentErrors, updateComment];

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
            removeCommentReferenceFromArr(req.user.comments, req.params.comment_id);
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
