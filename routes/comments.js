const express = require('express');
const router = express.Router();
const cc = commentsController = require('../controllers/comments');
const ah = authHelpers = require('../helpers/authentication');

router.post('/:story_id', cc.create);

router.put('/:story_id/comments/:comment_id', ah.ensureLoggedIn, ah.ensureUserOwnsComment, cc.update);

module.exports = router;