const express = require('express');
const router = express.Router();
const cc = commentsController = require('../controllers/comments');
const ah = authHelpers = require('../helpers/authentication');

router.post('/:story_id', cc.create);

router.put('/:story_id/:comment_id', cc.update);

module.exports = router;;