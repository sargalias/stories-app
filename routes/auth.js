const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
}));

router.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    (req, res, next) => {
        res.redirect('/');
    }
);

module.exports = router;