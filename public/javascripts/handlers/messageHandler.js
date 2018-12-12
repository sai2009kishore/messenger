var mongoUtil = require('../../utils/mongoUtil');
var Response = require('../../utils/response');
var jwt = require('jsonwebtoken');
var config = require('../../../config.json');

class MessageController {
    getMessages(req, callback) {
        var outer = this;
        this._decodeToken(req, function (user) {
            outer._getMessages({ $or: [{ sender: user.id }, { receiver: user.id }] }, null, callback);
        });
    }

    _getMessages(message, options, callback) {
        let db = mongoUtil.getDb();
        db.collection('Messages').find(message, options || {}).toArray(function (err, result) {
            if (err) {
                callback(new Response(500, err.message));
            } else {
                callback(new Response(200, 'Retrieved successfully', result));
            }
        });
    }

    createMessage(req, callback) {
        let db = mongoUtil.getDb();
        let message = req.body;
        this._decodeToken(req, function (user) {
            message.sender = user.id;
            db.collection('Messages').insertOne(message, function (err, res) {
                if (err) {
                    if (err.message === 'Document failed validation') {
                        callback(new Response(400, 'Invalid payload'));
                    }
                    console.log(err);
                } else {
                    callback(new Response(200, 'Message sent successfully'));
                }
            });

        });
    }

    _decodeToken(req, callback) {
        jwt.verify(req.get('jwt-token'), config.SECRET_KEY, (err, decodedToken) => {
            if (err || !decodedToken) {
                callback(err);
            }

            callback(decodedToken.data);
        });
    }

    getMessagesByState(req, callback) {
        var outer = this;
        this._decodeToken(req, function (user) {
            outer._getMessages({ sender: user.id, state: parseInt(req.params.state) }, null, callback);
        });
    }
}

module.exports = { MessageController };