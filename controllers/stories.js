const Story = require('../models/Story');
const User = require('../models/User');
const {validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');
const async = require('async');
const {storyValidation} = require('../helpers/storyValidation');


module.exports.index = (req, res, next) => {
    Story
        .find({privacy: 'PUBLIC'})
        .sort({published: -1})
        .exec((err, stories) => {
            if (err) {
                return next(err);
            }
            console.log(stories);
            res.render('stories/index', {stories: stories});
        });
};

module.exports.new = (req, res, next) => {
    res.render('stories/new');
};


function createValidationErrors(req, res, next) {
    const errors = validationResult(req);
    const storyData = matchedData(req, {locations: ['body']});
    if (!errors.isEmpty()) {
        return res.render('stories/new', {errors: errors.array({onlyFirstError: true}), story: storyData})
    }
    return next();
}

function createStory(req, res, next) {
    const storyData = matchedData(req, {onlyValidData: false, locations: ['body']});
    storyData.allowComments = storyData.allowComments === 'true';
    storyData.authorId = req.user.id;
    storyData.authorName = req.user.name;
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
        res.redirect(`/stories/${results.storySave.id}`);
    });
}

module.exports.create = [storyValidation, createValidationErrors, createStory];

module.exports.show = (req, res, next) => {
    Story.findById(req.params.story_id, (err, story) => {
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
    Story.findById(req.params.story_id, (err, story) => {
        if (err) {
            return next(err);
        }
        if (!story) {
            let err = new Error('Story not found');
            err.statusCode = 404;
            return next(err);
        }
        if (!errors.isEmpty()) {
            storyData.id = story.id;
            return res.render('stories/edit', {errors: errors.array({onlyFirstError: true}), story: storyData})
        }
        // Story data is good
        story.title = storyData.title;
        story.privacy = storyData.privacy;
        story.allowComments = storyData.allowComments === 'true';
        story.body = storyData.body;
        story.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect(`/stories/${story.id}`);
        });
    });
}

module.exports.update = [storyValidation, updateStory];
