const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET users listing. */
router.get('/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
}));

router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    (req, res, next) => {
        res.redirect('/');
    }
);

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
