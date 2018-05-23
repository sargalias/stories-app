const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/dashboard', function(req, res, next) {
    res.render('users/dashboard');
});

module.exports = router;
