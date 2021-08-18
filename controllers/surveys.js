const Survey = require('../models/Survey');
const Question = require('../models/Question');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc Get all surveys
//@route GET /api/v1/surveys
//@access Public
exports.getSurveys = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
})

//@desc Get Survey by id
//@route GET /api/v1/survey/:id
//@access Public
exports.getSurvey = asyncHandler(async (req, res, next) => {
    const survey = await Survey.findById(req.params.id)?.populate('questions');
    if (!survey) {
        return next(new ErrorResponse(`Survey not found with the id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: survey });
});


//@desc Get all questions of a survey
//@route GET /api/v1/surveys/:id/questions
//@access Public
exports.getQuestionsBySurvey = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!req.params.id) {
        return next(
            new ErrorResponse(`Missing fields`), 400
        )
    }
    try {
        const survey = await Survey.findById(id)?.populate({
            path: "questions",
            select: "text answer"
        });
        if (!survey) {
            return next(
                new ErrorResponse(`No survey with the id ${id}`), 401
            )
        }

        res.status(200).json({ success: true, count: survey.questions.length, data: survey.questions });
    } catch (err) {
        res.status(400).json({ success: false, error: `${err.name} : wrong id format` })
    }
});

//@desc Create a survey
//@route POST /api/v1/surveys/
//@access Public
exports.createSurvey = asyncHandler(async (req, res, next) => {
    const { name, questions, description } = req.body;
    try {
        if (!questions) {
            return next(new ErrorResponse(`Missing questions parameter ${req.params.id}`, 400));
        }
        if (!name) {
            return next(new ErrorResponse(`Missing name parameter ${req.params.id}`, 400));
        }
        questionsList = [];
        let index = 0;
        questions.map((question) => {
            if (!question.text || (question.answer !== true && question.answer !== false)) {
                return next(new ErrorResponse(`Missing fields on question ${index++}`, 400));
            }
            questionsList.push(question);
        });
        let survey = await Survey.create({
            name: name,
            description: description ? description : undefined,
            questions: []
        });
        const id = survey.id;
        let updatedSurvey;
        for (let i = 0; i < questionsList.length; i++) {
            const { text, answer } = questionsList[i];
            question = await Question.create({
                text,
                answer
            });
            updatedSurvey = await Survey.findByIdAndUpdate(
                id,
                { $push: { questions: question._id } },
                { new: true, useFindAndModify: false }
            ).populate({
                path: 'questions',
                select: "text answer"
            }
            );
        }
        res.status(200).json({ success: true, data: updatedSurvey });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }
});

//@desc Update a survey
//@route PUT /api/v1/survey/:id
//@access Private (Reserved to admin)
//  (can only update name and description
//  questions can be updated seperatelly)
exports.updateSurvey = asyncHandler(async (req, res, next) => {
    let survey = await Survey.findById(req.params.id);
    if (!survey) {
        return next(
            new ErrorResponse(`No survey with the id of ${req.params.id}`), 404
        )
    }
    const updatedFields = {
        name: req.body.name,
        description: req.body.description ? req.body.description : undefined
    }
    survey = await Survey.findByIdAndUpdate(req.params.id, updatedFields, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: survey
    })
});

//@desc delete a survey
//@route DELETE /api/v1/surveys/:id
//@access Private
exports.deleteSurvey = asyncHandler(async (req, res, next) => {
    let survey = await Survey.findById(req.params.id);
    if (!survey) {
        return next(
            new ErrorResponse(`No survey with the id of ${req.params.id}`), 404
        )
    }
    await survey.remove();
    res.status(200).json({
        success: true,
        data: {}
    })
});

//@desc Take a Survey
//@route POST /api/v1/surveys/take/:id
//@access Public
exports.takeSurvey = (req, res, next) => {
    res.status(200).json({ success: true, message: `Take Survey ${req.params.id}` });
}