const express = require('express');
const router = express.Router();
const uc = usersController = require('../controllers/users');

/* GET users listing. */
router.get('/dashboard', function(req, res, next) {
    res.render('users/dashboard');
});

router.get('/:user_id', uc.show);

module.exports = router;
