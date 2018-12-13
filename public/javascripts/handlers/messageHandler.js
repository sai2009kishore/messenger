var mongoUtil = require('../../utils/mongoUtil');
var Response = require('../../utils/response');
var jwt = require('jsonwebtoken');
var config = require('../../../config.json');
var ObjectId = require('mongodb').ObjectID;

class MessageController {
    _getMessages(message, options, callback) {
        let db = mongoUtil.getDb();
        db.collection('Messages').find(message, options || {}).toArray(function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
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

    getMessages(req, callback) {
        var outer = this;
        this._decodeToken(req, function (user) {
            outer._getMessages({ $or: [{ sender: user.id }, { receiver: user.id }] }, null, function (err, result) {
                if (err) {
                    callback(new Response(500, err.message));
                } else {
                    callback(new Response(200, 'Retrieved successfully', result));
                }
            });
        });
    }

    getMessagesByState(req, callback) {
        var outer = this;
        this._decodeToken(req, function (user) {
            outer._getMessages({ sender: user.id, state: parseInt(req.params.state) }, null, function (err, result) {
                if (err) {
                    callback(new Response(500, err.message));
                } else {
                    callback(new Response(200, 'Retrieved successfully', result));
                }
            });
        });
    }

    createMessage(req, callback) {
        let db = mongoUtil.getDb();
        let message = req.body;
        message.state = 0;
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

    _updateMessage(query, newData, callback) {
        let db = mongoUtil.getDb();
        db.collection('Messages').update(query, newData, function (err, response) {
            callback(err, response.result);
        });
    }

    updateMessage(req, callback) {
        var outer = this;
        this._decodeToken(req, function (user) {
            outer._updateMessage(
                {
                    _id: ObjectId(req.body.message_id),
                    sender: user.id
                },
                {
                    $set: {
                        text: req.body.text,
                        isUpdated: true
                    }
                },
                function (err, result) {
                    if (err) {
                        callback(new Response(500, err.message));
                    } else {
                        if (result.n === 0) {
                            callback(new Response(400, 'You are not allowed to edit this message'));
                        } else if (result.nModified === 0) {
                            callback(new Response(200, 'No changes made'));
                        } else {
                            callback(new Response(200, 'Message edited successfully'));
                        }
                    }
                }
            );
        });
    }

    markAllAsDelivered(req, callback) {
        var outer = this;
        this._decodeToken(req, function (user) {
            outer._updateMessage(
                {
                    receiver: user.id,
                    sender: req.body.sender,
                    state: 0
                },
                {
                    $set: {
                        state: 1,
                    }
                },
                function (err, result) {
                    if (err) {
                        callback(new Response(500, err.message));
                    } else {
                        if (result.n === 0) {
                            callback(new Response(400, 'You are not allowed to edit this message'));
                        } else if (result.nModified === 0) {
                            callback(new Response(200, 'No changes made'));
                        } else {
                            callback(new Response(200, result.n + ' were messages marked delivered'));
                        }
                    }
                }
            );
        });
        // callback(new Response(200, 'Marked all messages as delivered'));
    }
}

module.exports = { MessageController };