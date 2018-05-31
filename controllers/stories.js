const Story = require('../models/Story');
const User = require('../models/User');
const Comment = require('../models/Comment');
const {validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');
const async = require('async');
const {storyValidation} = require('../helpers/storyValidation');
const ObjectId = require('mongoose').Types.ObjectId;


module.exports.index = (req, res, next) => {
    Story
        .find({privacy: 'PUBLIC'})
        .sort({published: -1})
        .exec((err, stories) => {
            if (err) {
                return next(err);
            }
            res.render('stories/index', {stories: stories});
        });
};

module.exports.new = (req, res, next) => {
    res.render('stories/new');
};


function createStory(req, res, next) {
    const errors = validationResult(req);
    const storyData = matchedData(req, {locations: ['body']});
    if (!errors.isEmpty()) {
        return res.render('stories/new', {errors: errors.array({onlyFirstError: true}), story: storyData})
    }
    storyData.allowComments = storyData.allowComments === 'true';
    storyData.authorId = req.user.id;
    storyData.authorName = req.user.name;
    storyData.authorImage = req.user.image;
    let newStory = new Story(storyData);
    async.parallel({
        storySave: function(cb) {
            newStory.save(cb);
        },
        userSave: function(cb) {
            User.findByIdAndUpdate(req.user.id, {
                $push: {stories: newStory}
            }, {'new': true}, cb);
        }
    }, function(err, results) {
        if (err) {
            // Delete story from user and stories collections
            Story.findByIdAndRemove(newStory.id);
            User.findById(req.user.id, (err, user) => {
                user.stories.id(newStory._id).remove();
            });
            return next(err);
        }
        req.flash('success', 'Story added');
        res.redirect(`/users/dashboard`);
    });
}

module.exports.create = [storyValidation, createStory];

module.exports.show = (req, res, next) => {
    Story
        .findById(req.params.story_id)
        .populate('comments.author')
        .exec((err, story) => {
        if (err) {
            return next(err);
        } else if (!story) {
            let err = new Error('Story not found');
            err.statusCode = 404;
            return next(err);
        } else {
            res.render('stories/show', {story: story});
        }
    });
};

module.exports.edit = (req, res, next) => {
    Story.findById(req.params.story_id, (err, story) => {
        if (err) {
            return next(err);
        }
        if (!story) {
            let err = new Error('Story could not be found');
            err.statusCode = 404;
            return next(err);
        }
        res.render('stories/edit', {story: story});
    });
};

function updateStory(req, res, next) {
    const errors = validationResult(req);
    const storyData = matchedData(req, {locations: ['body']});
    storyData.id = req.params.story_id;
    if (!errors.isEmpty()) {
        return res.render('stories/new', {errors: errors.array({onlyFirstError: true}), story: storyData})
    }
    Story.findByIdAndUpdate(req.params.story_id, {
        $set: {
            title: storyData.title,
            privacy: storyData.privacy,
            allowComments: storyData.allowComments === 'true',
            body: storyData.body
        }
    }, {new: true}, (err, updatedStory) => {
        if (err) {
            return next(err);
        }
        if (!updatedStory) {
            let err = new Error('Story not found');
            err.statusCode = 404;
            return next(err);
        }
        // manually update user stories
        req.user.stories.id(updatedStory._id).remove();
        req.user.stories.push(updatedStory);
        req.user.save((err) => {
            if (err) {
                console.error('Could not update user stories: Updated story id: ' + updatedStory.id);
                return next(err);
            } else {
                req.flash('success', 'Story edited');
                res.redirect(`/users/dashboard`);
            }
        });
    });
}



module.exports.update = [storyValidation, updateStory];

module.exports.delete = (req, res, next) => {
    // No need to check story exists, as ownership will have been verified previously.
    async.parallel({
        storyDelete: function(callback) {
            Story.findByIdAndRemove(req.params.story_id, callback);
        },
        commentsDelete: function(callback) {
            Comment.deleteMany({storyId: req.params.story_id}, callback);
        },
        userDelete: function(callback) {
            User.findByIdAndUpdate(req.user.id,
                    {$pull: {stories: {_id: ObjectId(req.params.story_id)}}})
                .populate('comments')
                .exec((err, user) => {
                    user.comments = user.comments.filter((comment) => {
                        return comment.storyId !== req.params.story_id;
                    });
                    user.save(callback);
                });
        }
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Story deleted');
        return res.redirect('/users/dashboard');
    });
};
