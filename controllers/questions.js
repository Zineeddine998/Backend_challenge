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
                new ErrorResponse(`No question with the id of ${req.params.id}`,
                404
                ));
        }
        res.status(200).json({ success: true, data: question });
    } catch (err) {
        res.status(400).json({ success: false, error: "Wrong request format" });
    }
}



//@desc delete a single question
//@route DELETE /api/v1/questions/:id
//@access Private
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
    let question = await Question.findById(req.params.id);
    if (!question) {
        return next(
            new ErrorResponse(`No question with the id of ${req.params.id}`,
            404
            ));
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
            new ErrorResponse(`No question with the id of ${req.params.id}`,
            404
            ));
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
