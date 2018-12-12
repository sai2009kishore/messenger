var mongoUtil = require('../../utils/mongoUtil');

class UserController {
    getUsers(callback) {
        let db = mongoUtil.getDb();
        db.collection('Users').find({}).toArray(function (err, result) {
            if (err) {
                callback(err.message);
            } else {
                callback(result);
            }
        });
    }

    createUser(user, callback) {
        let db = mongoUtil.getDb();
        db.collection('Users').insertOne(user, function (err, res) {
            if (err) {
                if (err.message === 'Document failed validation') {
                    callback('Invalid payload');
                }
                console.log(err);
            } else {
                callback('User created successfully');
            }
        });
    }
}

module.exports = { UserController };