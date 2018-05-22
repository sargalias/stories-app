if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
var express = require('express');
var path = require('path');
var logger = require('morgan');
const passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth/google', authRouter);

// Express-session config
require('./config/session')(app);

// Passport config
app.use(passport.initialize());
app.use(passport.session());
require('./config/auth')(passport);

module.exports = app;
