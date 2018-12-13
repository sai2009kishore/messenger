var mongoUtil = require('../../utils/mongoUtil');
var Response = require('../../utils/response');
var ObjectId = require('mongodb').ObjectID;

class UserController {
    getUsers(callback) {
        this._getUser({}, null, callback);
    }

    _getUser(user, options, callback) {
        let db = mongoUtil.getDb();
        db.collection('Users').find(user, options || { password: 0 }).toArray(function (err, result) {
            if (err) {
                callback(new Response(500, err.message));
            } else {
                callback(new Response(200, 'Retrieved successfully', result));
            }
        });
    }

    createUser(user, callback) {
        let db = mongoUtil.getDb();
        this._getUser({ email: user.email }, { email: 1 }, function (result) {
            if (result.data.length > 0) {
                callback(new Response(400, 'A user already exists with the given email'));
            } else {
                db.collection('Users').insertOne(user, function (err, res) {
                    if (err) {
                        if (err.message === 'Document failed validation') {
                            callback(new Response(400, 'Invalid payload'));
                        }
                        console.error(err);
                    } else {
                        callback(new Response(201, 'User created successfully'));
                    }
                });
            }
        });
    }
}

module.exports = { UserController };