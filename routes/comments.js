const express = require('express');
const router = express.Router();
const cc = commentsController = require('../controllers/comments');
const ah = authHelpers = require('../helpers/authentication');

router.post('/:story_id', ah.ensureLoggedIn, ah.ensureStoryAllowsComments, cc.create);

router.put('/:story_id/comments/:comment_id', ah.ensureLoggedIn, ah.ensureStoryAllowsComments, ah.ensureUserOwnsComment, cc.update);


router.delete('/:story_id/comments/:comment_id', ah.ensureLoggedIn, ah.ensureStoryAllowsComments, ah.ensureUserOwnsCommentOrStory, cc.delete);

module.exports = router;