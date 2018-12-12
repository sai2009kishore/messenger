var express = require('express');
var router = express.Router();
var messageRouter = require('./messageRouter');
var userRouter = require('./userRouter');
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
  // db.User.findByEmail(email)
  //     .then((user) => (!user) ? Promise.reject("User not found.") : user)
  //     .then((user) => user.comparePassword(password))
  //     .then((user) => user.publicParse(user))
  //     .then((user) => {
  //         res.status(200)
  //             .json({
  //                 success: true,
  //                 token: createJWToken({
  //                     sessionData: user,
  //                     maxAge: 3600
  //                 })
  //             })
  //     })
  //     .catch((err) => {
  //         res.status(401)
  //             .json({
  //                 message: err || "Validation failed. Given email and password aren't matching."
  //             })
  //     })

})

router.all('*', middleware.verifyJWT_MW);

router.get('/', function (req, res, next) {
  res.render('index');
});

router.use('/messages', messageRouter);
router.use('/users', userRouter);

module.exports = router;
