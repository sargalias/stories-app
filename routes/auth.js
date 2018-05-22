const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET users listing. */
router.get('/', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
}));

router.get('/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    (req, res, next) => {
        res.redirect('/');
    }
);

module.exports = router;
