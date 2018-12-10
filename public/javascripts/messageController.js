var mongoUtil = require('../utils/mongoUtil');

class MessageController {
    getMessages(callback) {
        let db = mongoUtil.getDb();
        db.collection('Messages').find({}).toArray(function (err, result) {
            if (err) {
                callback(err.message);
            } else {
                callback(result);
            }
        });
    }

    createMessage(message, callback) {
        let db = mongoUtil.getDb();
        db.collection('Messages').insertOne(message, function (err, res) {
            if (err) {
                if (err.message === 'Document failed validation') {
                    callback('Invalid payload');
                }
                console.log(err);
            } else {
                callback('Message sent successfully');
            }
        });
    }

    getMessagesByState(state, callback) {
        let db = mongoUtil.getDb();
        db.collection('Messages').find({ state: parseInt(state) }).toArray(function (err, result) {
            if (err) {
                callback(err.message);
            } else {
                callback(result);
            }
        });
    }
}

module.exports = { MessageController };