const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/auth/google', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    (req, res, next) => {
        res.redirect('/');
    }
);

module.exports = router;