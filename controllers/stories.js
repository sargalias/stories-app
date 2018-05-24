const Story = require('../models/Story');

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

module.exports.create = (req, res, next) => {
    // Takes html.
    // Must remove script tags
    // And save HTML as text
    // Then show the text as HTML
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

