const express = require('express');
const router = express.Router();
const sc = storiesController = require('../controllers/stories');
const ah = authHelpers = require('../helpers/authentication');

// Index
router.get('/', sc.index);

// New
router.get('/new', ah.ensureLoggedIn, sc.new);

// Create
router.post('/', ah.ensureLoggedIn, sc.create);

// Show
router.get('/:story_id', ah.ensureUserHasAccess, sc.show);

// Edit
router.get('/:story_id/edit', ah.ensureLoggedIn, ah.ensureUserOwnsStory, sc.edit);

// Put
router.put('/:story_id', ah.ensureLoggedIn, ah.ensureUserOwnsStory, sc.update);

router.delete('/:story_id', ah.ensureLoggedIn, ah.ensureUserOwnsStory, sc.delete);


module.exports = router;