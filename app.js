if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// Initialise database
const db = require('./config/database');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

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


module.exports = app;
