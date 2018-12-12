var express = require('express');
var router = express.Router();
var messageRouter = require('./messageHandler');
var userRouter = require('./userHandler');
var middleware = require('../middleware');
var { createJWToken } = require('../libs/auth');

router.post('/login', (req, res) => {

  res.status(200)
    .json({
      success: true,
      token: createJWToken({
        sessionData: {
          "name": "Sai Kishore",
          "email": "sai2009kishore@gmail.com",
        },
        maxAge: 3600
      })
    });
})

router.all('*', middleware.verifyJWT_MW);

router.get('/', function (req, res, next) {
    res.render('index');
  });

router.use('/messages', messageRouter);
router.use('/users', userRouter);

module.exports = router;
