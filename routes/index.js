var express = require('express');
var router = express.Router();
var messageRouter = require('./messageRouter');
var userRouter = require('./userRouter');
var middleware = require('../middleware');
var { handleLogin } = require('../public/javascripts/handlers/loginHandler');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('', function (req, res) {
  res.status(200).send({ 'status': 'up' });
});

router.post('/login', handleLogin);

router.all('*', middleware.verifyJWT_MW);

router.get('/', function (req, res, next) {
  res.render('index');
});

router.use('/messages', messageRouter);
router.use('/users', userRouter);

module.exports = router;
