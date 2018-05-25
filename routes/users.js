const express = require('express');
const router = express.Router();
const uc = usersController = require('../controllers/users');
const ah = authHelpers = require('../helpers/authentication');


router.get('/dashboard', ah.ensureLoggedIn, uc.dashboard);

/* GET users listing. */
router.get('/:user_id', uc.show);

module.exports = router;
