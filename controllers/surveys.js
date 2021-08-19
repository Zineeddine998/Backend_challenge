const Survey = require('../models/Survey');
const Question = require('../models/Question');
const Entry = require('../models/Entry');
const Answer = require('../models/Answer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc Get all surveys
//@route GET /api/v1/surveys
//@access Public
exports.getSurveys = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.searchWrapper);
})

//@desc Get Survey by id
//@route GET /api/v1/survey/:id
//@access Public
exports.getSurvey = asyncHandler(async (req, res, next) => {
    const survey = await Survey.findById(req.params.id)
        ?.populate('questions')
        ?.select('name description questions');
    if (!survey) {
        return next(
            new ErrorResponse(`No survey with the id of ${req.params.id}`,
            404
            ));
    }
    res.status(200).json({ success: true, data: survey });
});



//@desc Create a survey
//@route POST /api/v1/surveys/
//@access Public
exports.createSurvey = asyncHandler(async (req, res, next) => {
    const { name, questions, description } = req.body;
    try {
        if (!questions) {
            return next(
                new ErrorResponse(`Missing questions parameter`,
                    400)
            );
        }
        if (!name) {
            return next(
                new ErrorResponse(`Missing name parameter`,
                    400)
            );
        }
        if (!Array.isArray(questions)) {
            return next(new ErrorResponse(`Wrong format for attribute questions`,
                400));
        }
        if (questions.length == 0) {
            return next(new ErrorResponse(`Survey cannot have no questions`,
                400));
        }
        questionsList = [];
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].text) {
                return next(new ErrorResponse(`Missing fields on question ${i + 1}`, 400));
            }
            questionsList.push(questions[i]);
        }
        let survey = await Survey.create({
            name: name,
            description: description ? description : undefined,
            questions: [],
            entries: [],
        });
        const id = survey.id;
        let updatedSurvey;
        for (let i = 0; i < questionsList.length; i++) {
            const { text, answer } = questionsList[i];
            question = await Question.create({
                text,
            });
            updatedSurvey = await Survey.findByIdAndUpdate(
                id,
                { $push: { questions: question._id } },
                { new: true, useFindAndModify: false }
            ).populate({
                path: 'questions',
                select: "text answer"
            }
            ).select('name description questions');
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
//  questions and entries can be updated seperatelly)
exports.updateSurvey = asyncHandler(async (req, res, next) => {
    let survey = await Survey.findById(req.params.id);
    if (!survey) {
        return next(
            new ErrorResponse(`No survey with the id of ${req.params.id}`, 404
            ))
    }
    const updatedFields = {
        name: req.body.name,
        description: req.body.description ? req.body.description : undefined
    }
    survey = await Survey.findByIdAndUpdate(req.params.id, updatedFields, {
        new: true,
        runValidators: true
    }).select('name description')
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
            new ErrorResponse(`No survey with the id of ${req.params.id}`, 404
            ))
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
            new ErrorResponse(`Question missing fields`, 400
            ))
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
                new ErrorResponse(`No survey with this id`, 404
                ))
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
                    new ErrorResponse(`One of the questions is missing fields`, 400
                    ))
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
                new ErrorResponse(`No survey with this id`, 404
                ))
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
                new ErrorResponse(`No Question with the id of ${idq}`, 404
                ))
        }
        res.status(200).json({ success: true, count: survey.questions.length, data: survey });
    } catch (err) {
        res.status(400).json({ success: false })
    }
})

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
exports.takeSurvey = asyncHandler(async (req, res, next) => {
    const { answers } = req.body;
    if (answers) {
        answers.map(answerObject => {
            const { question_id, answer } = answerObject;
            if (!question_id || (answer !== true && answer !== false)) {
                return next(
                    new ErrorResponse(`One of the answers is missing fields`, 400
                    ))
            }
        })
    }
    try {
        // Check if all the answered questions are in the survey
        let survey = await Survey.findById(req.params.id);
        const surveyExtended = await Survey.findById(req.params.id).populate({
            path: "questions",
            select: "answer"
        });
        answers.map(answer => {
            if (!survey.questions.includes(answer.question_id)) {
                return next(new ErrorResponse(`Question with id ${answer.question_id} was not found in survey`, 404));
            }
        });
        let questionsId = answers.map(answer => answer.question_id);
        surveyExtended.questions.map(question => {
            if (!questionsId.includes(question._id.toString())) {
                return next(new ErrorResponse(`Missing answer to question with id ${question._id}`, 400));
            }
        });
        let entry = await Entry.create({
            answers: []
        });
        const id = entry.id;
        let updatedEntry;
        let listOfAnswers = [];
        for (let i = 0; i < answers.length; i++) {
            const { question_id, answer } = answers[i];
            let currentQuestion = await Question.findById(question_id);
            let newAnswer = await Answer.create({
                text: currentQuestion.text,
                answer: answer,
                question: currentQuestion._id,
            });
            listOfAnswers.push(newAnswer);
        }
        updatedEntry = await Entry.findByIdAndUpdate(
            id,
            { $push: { answers: { $each: listOfAnswers } } },
            { new: true, useFindAndModify: false }
        ).populate({
            path: "answers",
            select: "text answer"
        })
        survey = await Survey.findByIdAndUpdate(
            req.params.id,
            { $push: { entries: updatedEntry._id } },
            { new: true, useFindAndModify: false }
        );
        res.status(200).json({ success: true, message: "Entry saved", data: updatedEntry });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});




