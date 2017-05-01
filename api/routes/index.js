var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
var CommonController = require('../controllers/CommonController');

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/login', function (req, res, next) {
    authController.login(req, res);
});

router.post('/register', function (req, res, next) {
    authController.register(req, res);
});

router.post('/imageUpload', function (req, res) {
    CommonController.imageUpload(req, res);
});

router.get('/getImage', function (req, res) {
    CommonController.getImage(req, res);
});

module.exports = router;
