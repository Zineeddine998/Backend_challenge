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
        return next(
            new ErrorResponse(`No survey with the id of ${req.params.id}`),
            404
        );
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
            new ErrorResponse(`Missing id field`),
            400
        );
    }
    try {
        const survey = await Survey.findById(id)?.populate({
            path: "questions",
            select: "text answer"
        });
        if (!survey) {
            return next(
                new ErrorResponse(`No survey with the id of ${req.params.id}`),
                404
            );
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
            return next(
                new ErrorResponse(`Missing questions parameter`),
                400
            );
        }
        if (!name) {
            return next(
                new ErrorResponse(`Missing name parameter`),
                400
            );
        }
        questionsList = [];
        let index = 0;
        questions.map((question) => {
            if (!question.text || (question.answer !== true && question.answer !== false)) {
                return next(new ErrorResponse(`Missing fields on question ${index++}`), 400);
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
//@route PUT /api/v1/surveys/:id
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

//@desc Add a question to a survey
//@route PUT /api/v1/surveys/:id/questions
//@access Public
exports.addQuestionToSurvey = asyncHandler(async (req, res, next) => {
    const { text, answer } = req.body;
    if (!text || (answer !== true && answer !== false) || !req.params.id) {
        return next(
            new ErrorResponse(`Question missing fields`), 400
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
                new ErrorResponse(`No survey with this id`), 404
            )
        }
        res.status(200).json({ success: true, count: survey.questions.length, data: survey });
    } catch (err) {
        res.status(400).json({ success: false })
    }
});

//@desc Add an array of questions to a survey
//@route PUT /api/v1/surveys/:id/many/questions/
//@access Public
exports.addManyQuestionsToSurvey = asyncHandler(async (req, res, next) => {
    if (req.body.questions) {
        req.body.questions.map(question => {
            const { text, answer } = question;
            if (!text || (answer !== true && answer !== false)) {
                return next(
                    new ErrorResponse(`One of the questions is missing fields`), 400
                )
            }
        })
    }
    try {
        let questionsList = req.body.questions.map(async question => {
            const newQuestion = await Question.create({
                text: question.text,
                answer: question.answer
            });
            return newQuestion._id;
        })
        let list = await Promise.all(questionsList);
        let survey = await Survey.findByIdAndUpdate(
            req.params.id,
            { $push: { questions: { $each: list } } },
            { new: true, useFindAndModify: false }
        )?.populate({
            path: 'questions',
            select: "text answer"
        });
        if (!survey) {
            return next(
                new ErrorResponse(`No survey with this id`), 404
            )
        }
        res.status(200).json({ success: true, count: survey.questions.length, data: survey });
    } catch (err) {
        res.status(400).json({ success: false })
    }
});

//@desc Add a question to a survey
//@route PUT /api/v1/surveys/:ids/questions/:idq
//@access Public
exports.removeQuestionFromSurvey = asyncHandler(async (req, res, next) => {
    const { ids, idq } = req.params;
    try {
        const survey = await Survey.findByIdAndUpdate(
            ids,
            { $pull: { questions: idq } },
            { new: true, useFindAndModify: false }
        )?.populate({
            path: 'questions',
            select: "text answer"
        }
        );
        const removedQuestion = await Question.findById(idq);
        await removedQuestion.remove();
        if (!survey) {
            return next(
                new ErrorResponse(`No Question with the id of ${idq}`), 404
            )
        }
        res.status(200).json({ success: true, count: survey.questions.length, data: survey });
    } catch (err) {
        res.status(400).json({ success: false })
    }
})

// //@desc delete a survey
// //@route DELETE /api/v1/surveys/:id
// //@access Private
// exports. = asyncHandler(async (req, res, next) => {
//     let survey = await Survey.findById(req.params.id);
//     if (!survey) {
//         return next(
//             new ErrorResponse(`No survey with the id of ${req.params.id}`), 404
//         )
//     }
//     await survey.remove();
//     res.status(200).json({
//         success: true,
//         data: {}
//     })
// });


//@desc Take a Survey
//@route POST /api/v1/surveys/take/:id
//@access Public
exports.takeSurvey = asyncHandler(async (req, res, next) => {
    if (req.body.questions) {
        req.body.questions.map(question => {
            const { id, answer } = question;
            if (!id || (answer !== true && answer !== false)) {
                return next(
                    new ErrorResponse(`One of the questions is missing fields`), 400
                )
            }
        })
    }
    try {
        // Check if all the answered questions are in the survey
        const survey = await Survey.findById(req.params.id);
        const surveyExtended = await Survey.findById(req.params.id).populate({
            path: "questions",
            select: "answer"
        });
        req.body.questions.map(question => {
            if (!survey.questions.includes(question.id)) {
                return next(new ErrorResponse(`Question with id ${question.id} was not found in survey`), 404);
            }
        });
        let scoreList = [];
        req.body.questions.map(question => {
            if (correctAnswer(surveyExtended.questions, question)) {
                scoreList.push(question.answer);
            }
        });
        res.status(200).json({ success: true, score: scoreList.length, out_of: survey.questions.length });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

const correctAnswer = (QuestionsList, question) => {
    for (let i = 0; i < QuestionsList.length; i++) {
        if (QuestionsList[i]._id == question.id && QuestionsList[i].answer === question.answer) {
            return true;
        }
    }
    return false;
}


