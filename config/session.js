module.exports = function(app) {
    const sess = {
        secret: process.env.SESSION_SECRET,
        cookie: {
            resave: false,
            saveUninitialized: true
        }
    };

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1); // trust first proxy
        sess.cookie.secure = true // serve secure cookies
    }

    app.use(session(sess));
};