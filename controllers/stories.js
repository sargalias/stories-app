const Story = require('../models/Story');
const {checkSchema, validationResult} = require('express-validator/check');


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
        }
    }
});

module.exports.create = (req, res, next) => {
    // Takes html.
    // Must remove script tags
    // And save HTML as text
    // Then show the text as HTML
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
    }
    res.send(req.body);
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

