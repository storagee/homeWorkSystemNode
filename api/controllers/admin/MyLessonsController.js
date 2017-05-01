var utils = require('../utils');
var mongoose = require('mongoose');
var Lesson = mongoose.model('Lesson');

module.exports.createLesson = function (req, res) {
    var body = req.body,
        lesson = {};
    lesson.name = body.name;
    lesson.description = body.description;
    lesson.imageId = body.imageId;
    lesson.teacher = body.teacher;
    lesson.isNeedApply = body.isNeedApply;
    Lesson.create(lesson, function (error, lesson) { // Mongoose 事先定义好的 Model
        if(error) {
            utils.jsonResponse(res, 500, {
                ret: -1,
                msg: error
            })
        } else {
            utils.jsonResponse(res, 200, {
                ret: 0,
                msg: '',
                data: {
                    lesson: lesson
                }
            })
        }
    });
};

module.exports.getLessonList = function (req, res) {
    Lesson.find({
        teacher: req.query.teacher
    }, function (error, lessons) {
        if(error) {
            utils.jsonResponseError(res, error);
        } else {
            utils.jsonResponse(res, 200, {
                ret: 0,
                msg: '',
                data: {
                    lessons: lessons
                }
            })
        }
    })
};