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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// Express-session config
require('./config/session')(app);

// Passport config
app.use(passport.initialize());
app.use(passport.session());
require('./config/auth')(passport);

module.exports = app;
