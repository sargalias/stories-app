const Story = require('../models/Story');
const User = require('../models/User');

module.exports.show = (req, res, next) => {
    User.findById(req.params.user_id, (err, user) => {
        let storiesToShow = user.stories.filter((story) => {
            return story.privacy === 'PUBLIC';
        });
        res.render('users/show', {stories: storiesToShow, passedUser: user});
    });
};

module.exports.dashboard = (req, res, next) => {
    res.render('users/dashboard');
};
