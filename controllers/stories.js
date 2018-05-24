const Story = require('../models/Story');
const User = require('../models/User');
const {checkSchema, validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');
const {removeScriptTags} = require('../helpers/remove-script-tags');
const async = require('async');


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

module.exports.storyValidation = checkSchema({
    title: {
        in: ['body'],
        trim: true,
        errorMessage: 'Title is required',
        isLength: {
            options: {min: 1}
        },
        escape: true
    },
    privacy: {
        in: ['body'],
        errorMessage: 'Invalid choice for status',
        exists: true,
        custom: {
            errorMessage: 'Invalid value for Allow Comments',
            options: (val, {req}) => {
                return val.match(/^(PUBLIC|PRIVATE|UNLISTED)$/) != null;
            }
        },
        escape: true
    },
    // if allowComments exists, it must equal true
    allowComments: {
        in: ['body'],
        errorMessage: 'Invalid value for Allow Comments',
        optional: true,
        custom: {
            options: (val, {req}) => {
                return val.match(/^true$/) != null;
            }
        },
        escape: true
    },
    body: {
        in: ['body'],
        errorMessage: 'Body is required',
        trim: true,
        isLength: {
            options: {min: 1}
        },
        custom: {
            options: (val, {req}) => {
                return val.match(/^<p>&nbsp;<\/p>$/) === null;
            }
        },
        customSanitizer: {
            options: (val) => {
                return removeScriptTags(val);
            }
        }
    }
});

module.exports.create = (req, res, next) => {
    const errors = validationResult(req);
    const storyData = matchedData(req, {onlyValidData: false, locations: ['body']});
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.render('stories/new', {errors: errors.array({onlyFirstError: true}), story: storyData})
    }
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
};

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

