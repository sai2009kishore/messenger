var express = require('express');
var router = express.Router();
var { UserController } = require('../public/javascripts/handlers/userHandler');
var userController = new UserController();

router.get('/', function (req, res, next) {
    userController.getUsers(function (result) {
        res.status(result.getStatus()).send(result);
    });
});

router.get('/:id', function (req, res, next) {
    userController.getUserById(req.params.id, function (result) {
        res.status(result.getStatus()).send(result);
    });
});

router.post('/', function (req, res, next) {
    userController.createUser(req.body, function (result) {
        res.status(result.getStatus()).send(result);
    });
});

module.exports = router;
