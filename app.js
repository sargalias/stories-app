// Initial configuration
require('./config/initialization');

const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const viewHelpers = require('./helpers/views');
const methodOverride = require('method-override');


// General express configuration
const app = express();
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Method override
app.use(methodOverride('_method'));

// View engine ejs
app.set('view engine', 'ejs');

// Express-session config
require('./config/session')(app);

// Passport config
require('./config/auth')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
require('./config/flash-messages')(app);


// Global app vars
app.locals.viewHelpers = viewHelpers;
// Global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});


// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const storiesRouter = require('./routes/stories');
const commentsRouter = require('./routes/comments');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/stories', storiesRouter);
app.use('/stories', commentsRouter);


module.exports = app;
