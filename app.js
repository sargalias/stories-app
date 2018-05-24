if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// Initialise database
const db = require('./config/database');

// Seed database
if (process.env.SEED_DATABASE === 'true') {
    require('./config/database-seed');
}

const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const exphbs = require('express-handlebars');
const exphbsHelpers = require('./helpers/handlebars');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const storiesRouter = require('./routes/stories');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
const hbs = exphbs.create({
    helpers: {
        footerDate: exphbsHelpers.footerDate,
        trimTags: exphbsHelpers.trimTags,
        trimBody: exphbsHelpers.trimBody,
        formatDate: exphbsHelpers.formatDate
    },
    defaultLayout: 'main'
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Express-session config
require('./config/session')(app);

// Passport config
require('./config/auth')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/stories', storiesRouter);


module.exports = app;
