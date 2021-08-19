const Question = require('../models/Question');
const Survey = require('../models/Survey');
const Answer = require('../models/Answer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');



//@desc Get all answers
//@route GET /api/v1/answers
//@access Public
exports.getAnswers = async (req, res, next) => {
    res.status(200).json(res.searchWrapper);
}
//@desc Get a single answer
//@route GET /api/v1/answers/:id
//@access Public
exports.getAnswer = async (req, res, next) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (!answer) {
            return next(
                new ErrorResponse(`No answer with the id of ${req.params.id}`,
                    404
                ));
        }
        res.status(200).json({ success: true, data: answer });
    } catch (err) {
        res.status(400).json({ success: false, error: "Wrong request format" });
    }
}

//@desc Get all answers of a question
//@route GET /api/v1/answers/question/:id
//@access Public
exports.getAnswersByQuestion = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(
            new ErrorResponse(`Missing id field`,
                400
            ));
    }
    try {
        const answers = await Answer.find({
            question: id
        });
        if (!answers) {
            return next(
                new ErrorResponse(`No survey with the id of ${req.params.id}`,
                    404)
            );
        }

        res.status(200).json({ success: true, count: answers.length, data: answers });
    } catch (err) {
        res.status(400).json({ success: false, error: `${err.name} : wrong id format` })
    }
});
