var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

/**
 * 老师
 */
var teachersSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    userName: String,
    mobile: Number,
    questionSet: [{ // 拥有的题库，多对多的关系
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionSet'
    }],
    created: {
        type: Date,
        "default": Date.now
    }
});

/**
 * 学生
 */
var studentsSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    userName: String,
    mobile: Number,
    lessons: [{ // 加入的课程
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    applyLessons: [{ // 申请的课程
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    created: {
        type: Date,
        "default": Date.now
    }
});

/**
 * 单选题
 */
var singleChoicesSchema = new mongoose.Schema({
    title: {
        type: String
    },
    option: [String], // 单选题的选项
    correctIndex: Number, // 正确答案的下标
    created: {
        type: Date,
        "default": Date.now
    }
});

/**
 * 多选题
 */
var multipleChoicesSchema = new mongoose.Schema({
    title: {
        type: String
    },
    option: [String], //多选题选项
    correctIndex: [Number], // 正确答案的下标
    created: {
        type: Date,
        "default": Date.now
    }
});

/**
 * 判断题
 */
var judgmentsSchema = new mongoose.Schema({
    content: { // 判断题题干
        type: String
    },
    isCorrect: Boolean, // 答案
    created: {
        type: Date,
        "default": Date.now
    }
});

/**
 * 填空题
 */
var fillBlanksSchema = new mongoose.Schema({
    content: { // 填空题，存储着 text，内含下划线的空格（html+css表示）
        type: String
    },
    answer: [{ // 正确答案，即使不输入，也要存入空字符，这样才能知道有几个空
        content: String
    }],
    created: {
        type: Date,
        "default": Date.now
    }
});

/**
 * 简答题
 */
var shortAnswerQuestionsSchema = new mongoose.Schema({
    title: {
        type: String
    },
    answer: {
        type: String
    },
    created: {
        type: Date,
        "default": Date.now
    }
});

/**
 * 题库
 */
var questionSetSchema = new mongoose.Schema({
    teachers: [{ // 题库的拥有者（老师），题库与老师是多对多的关系
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }],
    setName: String,
    singleChoice: [singleChoicesSchema],
    multipleChoice: [multipleChoicesSchema],
    judgment: [judgmentsSchema],
    fillBlank: [fillBlanksSchema],
    subjectiveQuestions: [shortAnswerQuestionsSchema],
    created: {
        type: Date,
        "default": Date.now
    }
});

/**
 * 作业
 */
var homeworkSchema = new mongoose.Schema({
    name: String,
    // 作业的所有题目都存在这里 mongodb 不介意这么做，是冗余了，本该冗余，
    // 因为题库中的题目会删除，但是作业已经出了，不能删除，作业中的题的类型有：
    // singleChoices, multipleChoices, judgments, fillBlanks, shortAnswerQuestions，
    // 另外加上 illustrate，作为大题的解释，比如：一. 选择题，最后一题除外，每小题 3 分，最后一题 5 分
    // 题型（上面 5 种）的结构与题库中的一致，外加 score 字段，代表每道题的分数，也加 type 字段代表题目类型（上面的 5 种）
    // illustrate 的结构如下：
    // { type: 'illustrate', content: 'some illustrate'}
    questions: [],
    submitAnswer: [{
        // 作业里的答案，数组里的每个元素为一个学生的答案：
        // 比如 单选、多选、填空、简答分别为： [0, 1, 0, 2, 3, 1, [1,2,3], [0,1,2,3], '马克思主义', '毛泽东思想', '邓小平理论', '计算机科学是一门...']
        content: [],
        student: { // 谁的回答
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        created: { // 第一次提交时间
            type: Date,
            "default": Date.now
        },
        updated: [{ // 更新时间
            type: Date,
            "default": Date.now
        }]
    }],
    saveAnswer: [{
        // 学生临时保存的
        content: [],
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    }],
    startTime: Date.now, // 作业开始时间
    endTime: Date.now, // 作业结束时间
    description: String,
    created: {
        type: Date,
        "default": Date.now
    }
});

/**
 * 课程
 */
var lessonSchema = new mongoose.Schema({
    name: String,
    description: String,
    imageId: String,
    teacher: { // 老师
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    authStudents: [{ // 被授权的学生，默认是不需要授权的，直接申请即可加入，但是如果老师点击了需要授权才能加入，则不会被存到这里
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    isNeedApply: { // 加入课程是否需要申请，默认不需要
        type: Boolean,
        "default": false
    },
    applyStudents: [{ // 申请加入课程的学生, 如果老师通过申请，则移至 authStudents
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    homework: [homeworkSchema], // 该课程的作业
    created: {
        type: Date,
        "default": Date.now
    }
});
// lesson 增加 auto increment lessonId
lessonSchema.plugin(autoIncrement.plugin, 'lessonId');

//声明 model
mongoose.model('Teacher', teachersSchema);
mongoose.model('Student', studentsSchema);
mongoose.model('QuestionSet', questionSetSchema);
mongoose.model('HomeWork', homeworkSchema);
mongoose.model('Lesson', lessonSchema);