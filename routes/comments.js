const express = require('express');
const router = express.Router();
const cc = storiesController = require('../controllers/stories');
const ah = authHelpers = require('../helpers/authentication')

router.get('/stories/:story_id', ah.ensureLoggedIn, cc.create);

module.exports = router;;