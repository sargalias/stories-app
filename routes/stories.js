const express = require('express');
const router = express.Router();
const sc = storiesController = require('../controllers/stories');

/* GET home page. */
router.get('/', sc.index);

router.get('/:story_id', sc.show);

module.exports = router;