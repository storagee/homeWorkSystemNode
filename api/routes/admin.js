var express = require('express');
var router = express.Router();
var MyLessonsControllers = require('../controllers/admin/MyLessonsController');
var MyQuestionSetController = require('../controllers/admin/MyQuestionSetController');

router.post('/createLesson', function (req, res) {
    MyLessonsControllers.createLesson(req, res);
});

router.get('/getLessonList', function (req, res) {
    MyLessonsControllers.getLessonList(req, res);
});

router.post('/createQuestionSet', function (req, res) {
    MyQuestionSetController.createQuestionSet(req, res);
});

router.get('/getQuestionSetList', function (req, res) {
    MyQuestionSetController.getQuestionSetList(req, res);
});

router.get('/getQuestionSet', function (req, res) {
    MyQuestionSetController.getQuestionSet(req, res);
});

router.post('/addQuestionSet', function (req, res) {
    MyQuestionSetController.addQuestionSet(req, res);
});

router.post('/modifyQuestion', function (req, res) {
    MyQuestionSetController.modifyQuestion(req, res);
});

router.post('/deleteQuestion', function (req, res) {
    MyQuestionSetController.deleteQuestion(req, res);
});


module.exports = router;