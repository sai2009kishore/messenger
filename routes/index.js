var express = require('express');
var router = express.Router();
var messageRouter = require('./messageRouter');
var userRouter = require('./userRouter');
var middleware = require('../middleware');
var { handleLogin } = require('../public/javascripts/handlers/loginHandler');

router.post('/login', handleLogin);

router.all('*', middleware.verifyJWT_MW);

router.get('/', function (req, res, next) {
  res.render('index');
});

router.use('/messages', messageRouter);
router.use('/users', userRouter);

module.exports = router;
