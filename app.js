var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

var MongoClient = require('mongodb').MongoClient;
var config = require('./config.json');

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

let collections = ['Messages'];
// Connect to the db
MongoClient.connect(config.MONGODB_URL, function (err, db) {
  if (err) {
    throw err
  } else {
    let missing_collections = collections.slice();
    db.listCollections().toArray(function (err, collInfos) {
      collInfos.map(collection => {
        if (collections.includes(collection.name)) {
          missing_collections.pop(collection.name);
        }
      });
      missing_collections.map(collection => {
        db.createCollection(collection, { autoIndexId: true })
        console.log('Created collection ' + collection);
      });
    });
  }
});

module.exports = app;
