const express = require('express');
const router = express.Router();
const sc = storiesController = require('../controllers/stories');
const ah = authHelpers = require('../helpers/authentication');

// Index
router.get('/', sc.index);

// New
router.get('/new', ah.isLoggedIn, sc.new);

// Create
router.post('/', ah.isLoggedIn, sc.create);

// Show
router.get('/:story_id',ah.isLoggedIn, ah.storyAccessScontrol, sc.show);

// Edit
router.get('/:story_id/edit', ah.isLoggedIn, ah.ensureUserOwnsStory, sc.edit);

// Put
router.put('/:story_id', ah.isLoggedIn, ah.ensureUserOwnsStory, sc.update);

router.delete('/:story_id', ah.isLoggedIn, ah.ensureUserOwnsStory, sc.delete);


module.exports = router;