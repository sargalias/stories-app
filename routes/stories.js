const express = require('express');
const router = express.Router();
const sc = storiesController = require('../controllers/stories');

// Index
router.get('/', sc.index);

// New
router.get('/new', sc.new);

// Create
router.post('/', sc.create);

// Show
router.get('/:story_id', sc.show);

// Edit
router.get('/:story_id/edit', sc.edit);

// Put
router.put('/:story_id', sc.update);

router.delete('/:story_id', sc.delete);


module.exports = router;