var mongoose = require('mongoose');
var QuestionSet = mongoose.model('QuestionSet');
var utils = require('../utils');
var mongodb = require('mongodb');
var questionSetModels = {
    singleChoice: mongoose.model('singleChoice'),
    multipleChoice: mongoose.model('multipleChoice'),
    judgment: mongoose.model('judgment'),
    fillBlank: mongoose.model('fillBlank'),
    subjectiveQuestions: mongoose.model('subjectiveQuestions'),
};

module.exports.createQuestionSet = function (req, res) {
    var body = req.body,
        teacher = body.teacher,
        setName = body.setName;
    QuestionSet.create({
        teachers: teacher,
        setName: setName
    }, function (error, questionSet) {
        if(error) {
            utils.jsonResponseError(res, error);
        } else {
            QuestionSet.find({
                teachers: teacher
            }, function (error, questionSets) {
                if(error) {
                    utils.jsonResponseError(res, error);
                } else {
                    utils.jsonResponse(res, 200, {
                        ret: 0,
                        msg: '',
                        data: {
                            questionSets: questionSets
                        }
                    })
                }
            });
        }
    })
};

module.exports.getQuestionSetList = function (req, res) {
    var teacher = req.query.teacher;
    QuestionSet.find({
        teachers: teacher
    }, 'setName', function (error, questionSets) {
        if(error) {
            utils.jsonResponseError(res, error);
        } else {
            utils.jsonResponse(res, 200, {
                ret: 0,
                msg: '',
                data: {
                    questionSets: questionSets
                }
            })
        }
    })
};

module.exports.getQuestionSet = function (req, res) {
    var questionSetId = req.query.questionSetId;
    QuestionSet.findOne({
        _id: questionSetId
    }, function (error, questionSet) {
        if(error) {
            utils.jsonResponseError(res, error);
        } else {
            utils.jsonResponse(res, 200, {
                ret: 0,
                msg: '',
                data: {
                    questionSet: questionSet
                }
            })
        }
    });
};

module.exports.addQuestionSet = function (req, res) {
    var body = req.body,
        questionSetId = body.questionSetId,
        questionType = body.questionType,
        question = body.question;
    QuestionSet.findOne({
        _id: questionSetId
    }, function (error, questionSet) {
        if(error) {
            utils.jsonResponseError(res, error);
        } else {
            questionSet[questionType.englishName].push(question);
            questionSet.save(function (error, questionSet) {
                if(error) {
                    utils.jsonResponseError(res, error);
                } else {
                    utils.jsonResponse(res, 200, {
                        ret: 0,
                        msg: ''
                    })
                }
            });
        }
    });
};

module.exports.modifyQuestion = function (req, res) {
    var body = req.body,
        questionSetId = body.questionSetId,
        questionType = body.questionType,
        question = body.question;
    QuestionSet.findOne({
        _id: questionSetId,
    }, function (error, questionSet) {
        if(error) {
            utils.jsonResponseError(res, error);
        } else {
            var questionSetQuestions = questionSet[questionType.englishName];
            for(var i = 0; i < questionSetQuestions.length; i++) {
                if(questionSetQuestions[i]._doc._id.toString() === question._id) {
                    questionSetQuestions = questionSetQuestions.slice(0, i).concat(question).concat(questionSetQuestions.slice(i+1));
                    break;
                }
            }
            questionSet[questionType.englishName] = questionSetQuestions;
            questionSet.save(function (error, questionSet) {
                if(error) {
                    utils.jsonResponseError(res, error);
                } else {
                    utils.jsonResponse(res, 200, {
                        ret: 0,
                        msg: ''
                    })
                }
            });
        }
    });
};

module.exports.deleteQuestion = function (req, res) {
    var body = req.body,
        questionSetId = body.questionSetId,
        questionType = body.questionType,
        question = body.question;
    QuestionSet.findOne({
        _id: questionSetId,
    }, function (error, questionSet) {
        if(error) {
            utils.jsonResponseError(res, error);
        } else {
            var questionSetQuestions = questionSet[questionType.englishName];
            for(var i = 0; i < questionSetQuestions.length; i++) {
                if(questionSetQuestions[i]._doc._id.toString() === question._id) {
                    questionSetQuestions = questionSetQuestions.slice(0, i).concat(questionSetQuestions.slice(i+1));
                    break;
                }
            }
            questionSet[questionType.englishName] = questionSetQuestions;
            questionSet.save(function (error, questionSet) {
                if(error) {
                    utils.jsonResponseError(res, error);
                } else {
                    utils.jsonResponse(res, 200, {
                        ret: 0,
                        msg: ''
                    })
                }
            });
        }
    });
};