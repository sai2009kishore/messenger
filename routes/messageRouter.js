var express = require('express');
var router = express.Router();
var { MessageController } = require('../public/javascripts/handlers/messageHandler');
var messageController = new MessageController();
router.get('/', function (req, res, next) {
    messageController.getMessages(req, function (result) {
        res.status(result.getStatus()).send(result);
    });
});

router.post('/', function (req, res, next) {
    messageController.createMessage(req, function (result) {
        res.status(result.getStatus()).send(result);
    });
});

router.patch('/', function (req, res, next) {
    messageController.updateMessage(req, function (result) {
        res.status(result.getStatus()).send(result);
    });
});

router.patch('/markAllAsDelivered', function (req, res, next) {
    messageController.markAllAsDelivered(req, function (result) {
        res.status(result.getStatus()).send(result);
    });
});

router.get('/getMessagesByState/:state', function (req, res, next) {
    messageController.getMessagesByState(req, function (result) {
        res.status(result.getStatus()).send(result);
    });
});

module.exports = router;
