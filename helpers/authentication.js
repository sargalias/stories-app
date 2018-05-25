const Story = require('../models/Story');

const userOwnsStory = (req, res, next) => {
    for (let story of req.user.stories) {
        if (story._id.equals(req.params.story_id)) {
            return true;
        }
    }
    return false;
};

const isStoryPrivate = (req, res, next) => {
    Story.findById(req.params.story_id, (err, story) => {
        if (err) {
            return next(err);
        }
        if (!story) {
            let err = new Error('Story not found');
            err.statusCode = 404;
            return next(err);
        }
        return story.privacy === 'PRIVATE';
    });
};

module.exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        return next();
    } else {
        req.flash('alert', 'Please login');
        res.redirect('/');
    }
};

module.exports.ensureUserOwnsStory = (req, res, next) => {
    if (userOwnsStory(req, res, next)) {
        return next();
    } else {
        req.flash('alert', 'Not authorized');
        res.redirect('/stories');
    }
};

module.exports.storyAccessScontrol = (req, res, next) => {
    if (userOwnsStory(req, res, next) || !isStoryPrivate(req, res, next)) {
        return next();
    } else {
        req.flash('alert', 'Not authorized');
        res.redirect('/stories');
    }
};
