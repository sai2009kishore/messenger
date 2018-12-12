var { createJWToken } = require('../../../libs/auth');
var mongoUtil = require('../../utils/mongoUtil');

function handleLogin(req, res) {
    let db = mongoUtil.getDb();
    db.collection('Users').find({ email: req.body.email, password: req.body.password }, { password: 0 }).toArray(function (err, result) {
        if (err) {
            res.send(500).send('A server error occured while loggin in');
        } else {
            if (result.length === 0) {
                res.status(401).send('Invalid login credentials');
            } else {
                res.status(200)
                    .json({
                        success: true,
                        token: createJWToken({
                            sessionData: {
                                "name": result[0],
                                "email": "sai2009kishore@gmail.com",
                            },
                            maxAge: 3600
                        })
                    });
            }
        }
    });
}

module.exports = {
    handleLogin
};