const Comment = require('../models/Comment');
const {commentValidation} = require('../helpers/commentValidation');
const {validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');

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
    Comment.create({
        storyId: req.params.story_id,
        body: commentData.commentText,
        author: req.user,
    }, (err, comment) => {
        if (err)
            return next(err);
        return res.redirect('back');
    });
}

module.exports.create = [commentValidation, createComment];
