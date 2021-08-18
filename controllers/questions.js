const Survey = require('../models/Survey');
const Question = require('../models/Question');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


//@desc Get all questions
//@route GET /api/v1/questions
//@access Public
exports.getQuestions = async (req, res, next) => {
    try {
        const questions = await Question.find();
        res.status(200).json({ success: true, count: questions.length, data: questions });
    } catch (err) {
        res.status(400).json({ success: false })
    }
}
//@desc Get a single question
//@route GET /api/v1/questions/:id
//@access Public
exports.getQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return next(
                new ErrorResponse(`No quetion with the id of ${req.params.id}`), 404
            )
        }
        res.status(200).json({ success: true, data: question });
    } catch (err) {
        res.status(400).json({ success: false })
    }
}


//@desc Add a question to a survey
//@route POST /api/v1/questions/:id
//@access Public
exports.createQuestion = asyncHandler(async (req, res, next) => {
    const { text, answer } = req.body;
    if (!text || !answer || !req.params.id) {
        return next(
            new ErrorResponse(`Missing fields`), 400
        )
    }
    try {
        const question = await Question.create({
            text: text,
            answer: answer
        });
        const survey = await Survey.findByIdAndUpdate(
            req.params.id,
            { $push: { questions: question._id } },
            { new: true, useFindAndModify: false }
        )?.populate({
            path: 'questions',
            select: "text answer"
        }
        );
        if (!survey) {
            return next(
                new ErrorResponse(`No survey with this id`), 400
            )
        }
        res.status(200).json({ success: true, count: survey.questions.length, data: survey });
    } catch (err) {
        res.status(400).json({ success: false })
    }
})


//@desc delete a single question
//@route DELETE /api/v1/questions/:id
//@access Private
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
    let question = await Question.findById(req.params.id);

    if (!question) {
        return next(
            new ErrorResponse(`No question with the id of ${req.params.id}`), 404
        )
    }
    await question.remove();
    res.status(200).json({
        success: true,
        data: {}
    })
});

//@desc update a single question
//@route UPDATE /api/v1/questions/:id
//@access Private
exports.updateQuestion = asyncHandler(async (req, res, next) => {
    let question = await Question.findById(req.params.id);
    if (!question) {
        return next(
            new ErrorResponse(`No question with the id of ${req.params.id}`), 404
        )
    }
    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: question
    })
});

//@desc get a single question
//@route GET /api/v1/questions/:id
//@access Private
exports.updateQuestion = asyncHandler(async (req, res, next) => {
    let question = await Question.findById(req.params.id);
    if (!question) {
        return next(
            new ErrorResponse(`No question with the id of ${req.params.id}`), 404
        )
    }
    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: question
    })
});