const createError = require('http-errors');
const express = require('express');
const hbs = require('hbs')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const reviewsRouter = require('./routes/reviews');
const searchRouter = require('./routes/search');
const spotify = require('./public/javascripts/methods');
const app = express();
const dotenv = require('dotenv');

//Set up sessions
const session = require('express-session');
app.use(session({ secret: 'secret-unique-code', cookie: { maxAge: 3600000 }, resave: true, saveUninitialized: true }));

hbs.registerHelper("equal", require("handlebars-helper-equal"))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/reviews', reviewsRouter);
app.use('/search', searchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const mongoose = require('mongoose');
const mongoURI = process.env.MONGOURI;
mongoose.connect(mongoURI)
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));
module.exports = app;
