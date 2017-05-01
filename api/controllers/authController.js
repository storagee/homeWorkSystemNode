var mongoose = require('mongoose');
var Teacher = mongoose.model('Teacher');
var Student = mongoose.model('Student');
var QuestionSet = mongoose.model('QuestionSet');
var utils = require('./utils');

module.exports.login = function (req, res) {

};

module.exports.register = function (req, res) {
    var body = req.body,
        email = body.email,
        password = body.password,
        isAdmin = body.isAdmin;
    if(isAdmin) {
        QuestionSet.create({
            teachers: [],
            setName: "未分类",
            singleChoice: [],
            multipleChoice: [],
            judgment: [],
            fillBlank: [],
            subjectiveQuestions: []
        }, function (error, questionSet) {
            if(error) {
                utils.jsonResponse(res, 200, {
                    ret: -1,
                    msg: '额哦，发生了错误'
                })
            } else {
                Teacher.create({
                    email: email,
                    password: password,
                    questionSet: [questionSet._id]
                }, function (error, teacher) {
                    if(error) {
                        var errorMessage = error.message;
                        if(errorMessage.indexOf('duplicate')){
                            utils.jsonResponse(res, 200, {
                                ret: -1,
                                msg: '账号已存在'
                            })
                        } else {
                            utils.jsonResponse(res, 200, {
                                ret: -1,
                                msg: '额哦，发生了错误'
                            })
                        }
                    } else {
                        questionSet.teachers.push(teacher._id);
                        questionSet.save(function (error, updatedQuestionSet) {
                            if(error) {
                                utils.jsonResponse(res, 200, {
                                    ret: -1,
                                    msg: '额哦，发生了错误'
                                })
                            } else {
                                utils.jsonResponse(res, 200, {
                                    ret: 0,
                                    msg: ''
                                })
                            }
                        })
                    }
                })
            }
        });
    } else {
        Student.create({
            email: email,
            password: password
        }, function (error, student) {
            if(error) {
                var errorMessage = error.message;
                if(errorMessage.indexOf('duplicate')){
                    utils.jsonResponse(res, 200, {
                        ret: -1,
                        msg: '账号已存在'
                    })
                } else {
                    utils.jsonResponse(res, 200, {
                        ret: -1,
                        msg: '额哦，发生了错误'
                    })
                }
            } else {
                utils.jsonResponse(res, 200, {
                    ret: 0,
                    msg: ''
                })
            }
        })
    }
};

module.exports.login = function (req, res) {
    var body = req.body,
        email = body.email,
        password = body.password,
        isAdmin = body.isAdmin;
    if(isAdmin) {
        Teacher.find({
            email: email
        }, function (error, teacher) {
            if(error) {
                utils.jsonResponse(res, 500, {
                    ret: -1,
                    msg: '额哦，发生了错误'
                })
            } else {
                if(teacher.length !== 0 && teacher[0].password === password) {
                    utils.jsonResponse(res, 200, {
                        ret: 0,
                        msg: '',
                        data: {
                            userId: teacher[0]._id
                        }
                    })
                } else {
                    utils.jsonResponse(res, 200, {
                        ret: -1,
                        msg: '用户不存在或密码错误'
                    })
                }
            }
        })
    } else {
        Student.find({
            email: email
        }, function (error, student) {
            if(error) {
                utils.jsonResponse(res, 500, {
                    ret: -1,
                    msg: '额哦，发生了错误'
                })
            } else {
                if(student.length !== 0 && student[0].password === password) {
                    utils.jsonResponse(res, 200, {
                        ret: 0,
                        msg: '',
                        data: {
                            userId: student[0]._id
                        }
                    })
                } else {
                    utils.jsonResponse(res, 200, {
                        ret: -1,
                        msg: '用户不存在或密码错误'
                    })
                }
            }
        })
    }
};