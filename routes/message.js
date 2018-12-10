var express = require('express');
var router = express.Router();
var { MessageController } = require('./../public/javascripts/messageController');
var messageController = new MessageController();
router.get('/', function (req, res, next) {
    messageController.getMessages(function (result) {
        res.send(result);
    });
});

router.post('/', function (req, res, next) {
    messageController.createMessage(req.body, function (result) {
        res.send(result);
    });
});

router.get('/getMessagesByState/:state', function (req, res, next) {
    messageController.getMessagesByState(req.params.state, function(result) {
        res.send(result);
    });
});

module.exports = router;
