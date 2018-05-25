const express = require('express');
const router = express.Router();
const uc = usersController = require('../controllers/users');
const ah = authHelpers = require('../helpers/authentication');


/* GET users listing. */
router.get('/dashboard', function(req, res, next) {
    res.render('users/dashboard');
});

router.get('/:user_id', uc.show);

router.get('/dashboard', ah.ensureLoggedIn, uc.dashboard);

module.exports = router;
