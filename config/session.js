const session = require('express-session');
const MemoryStore = require('memorystore')(session);

module.exports = function(app) {
    const sess = {
        store: new MemoryStore({
            checkPeriod: 1000 * 60 * 60 * 24,
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
        }
    };

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1); // trust first proxy
        sess.cookie.secure = true // serve secure cookies
    }

    app.use(session(sess));
};