var MongoClient = require('mongodb').MongoClient;
var config = require('../../config.json');

var _db;

module.exports = {

    connectToServer: function (callback) {
        MongoClient.connect(config.MONGODB_URL, function (err, db) {
            _db = db;
            return callback(err, db);
        });
    },

    getDb: function () {
        return _db;
    }
};