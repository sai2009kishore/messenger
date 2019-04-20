var { createJWToken } = require('../../../libs/auth');
var mongoUtil = require('../../utils/mongoUtil');
var messageConstants = require('../../constants/messageConstants');
var modelNames = require('../../constants/modelNames');

function handleLogin(req, res) {
    let db = mongoUtil.getDb();
    db.collection(modelNames.USERS).find({ email: req.body.email, password: req.body.password }, { password: 0 }).toArray(function (err, result) {
        if (err) {
            res.status(500).send(messageConstants.SERVER_EROR_WHILE_LOGIN);
        } else {
            if (result.length === 0) {
                res.status(401).send(messageConstants.INVALID_LOGIN_CREDENTIALS);
            } else {
                res.status(200)
                    .json({
                        success: true,
                        token: createJWToken({
                            sessionData: {
                                'name': result[0].name,
                                'email': result[0].email,
                                'id': result[0]._id,
                                'loginTime': new Date(),
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