var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoUtil = require('./public/utils/mongoUtil');
var indexRouter = require('./routes/index');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

let collections = require('./config.json').INITIAL_DB;

mongoUtil.connectToServer(function (err, db) {
  if (err) {
    throw err
  } else {
    console.log('Connected to MongoDB');
    let missing_collections = Object.keys(collections);
    db.listCollections().toArray(function (err, collInfos) {
      collInfos.map(collection => {
        if (collection.name in collections) {
          missing_collections.pop(collection.name);
        }
      });
      missing_collections.map(collection => {
        db.createCollection(collection, collections[collection]);
        console.log('Created collection ' + collection);
      });
      if (missing_collections.indexOf('Users') > -1) {
        let defaultUser = { name: "admin", password: "admin", email: "admin@messenger.com" };
        db.collection('Users').insertOne(defaultUser, function (err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log('Admin created successfully');
          }
        });
      }
    });
  }
});

module.exports = app;
