const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({googleId: profile.id}, (err, user) => {
                if (err) {
                    return done(err);
                }
                else if (!user) {
                    // Create user
                    User.create({googleId: profile.id, name: profile.displayName}, (err, user) => {
                        if (err) {
                            return done(err);
                        }
                        return done(null, user);
                    });
                }
                else {
                    return done(null, user);
                }
            });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, done);
    });
};