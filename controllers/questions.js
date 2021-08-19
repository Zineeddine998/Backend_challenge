const Question = require('../models/Question');
const Survey = require('../models/Survey');
const Answer = require('../models/Answer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { cloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');


//@desc Get all questions
//@route GET /api/v1/questions
//@access Public
exports.getQuestions = async (req, res, next) => {
    res.status(200).json(res.searchWrapper);
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

//@desc Get all questions of a survey
//@route GET /api/v1/questions/survey/:id
//@access Public
exports.getQuestionsBySurvey = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!req.params.id) {
        return next(
            new ErrorResponse(`Missing id field`,
                400
            ));
    }
    try {
        const survey = await Survey.findById(id)?.populate({
            path: "questions",
            select: "text answer"
        });
        if (!survey) {
            return next(
                new ErrorResponse(`No survey with the id of ${req.params.id}`,
                    404)
            );
        }

        res.status(200).json({ success: true, count: survey.questions.length, data: survey.questions });
    } catch (err) {
        res.status(400).json({ success: false, error: `${err.name} : wrong id format` })
    }
});


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



// @desc      Upload description image for question
// @route     PUT /api/v1/questions/:id/photo
// @access    Private
exports.uploadImageQuestion = asyncHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.id);
    if (!question) {
        return next(
            new ErrorResponse(`Question not found with id of ${req.params.id}`, 404)
        );
    }
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }
    const file = req.files.file;
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }
    file.name = `image_${question._id}${path.parse(file.name).ext}`;
    const filepath = `${process.env.FILE_UPLOAD_PATH}/${file.name}`;
    await file.mv(filepath, async err => {
        if (err) {
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
    });
    cloudinary.uploader.upload(filepath)
        .then(async (result) => {
            let url = result.url;
            const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, { description_image: url });

            try {
                fs.unlinkSync(filepath)
            } catch (err) {
            }
            res.status(200).json({
                success: true,
                data: updatedQuestion
            });
        })
        .catch((error) => {
            return next(new ErrorResponse(`Problem with file upload | ${error}`, 500));
        });


});



//@desc Get statistics for a question
//@route GET /api/v1/questions/:id/metrics
//@access Private
exports.getQuestionStats = asyncHandler(async (req, res, next) => {
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
        if (!Array.isArray(answers) || answers.length == 0) {
            return next(
                new ErrorResponse(`The question with the id ${req.params.id} have no recorded answers`,
                    404))

        }
        let metricsObject = {
            totalAnswers: answers.length,
            answered_true: 0,
            answered_false: 0,
            answered_false_percentage: 0,
            answered_true_percentage: 0,
        };
        let trueAnswers = 0;
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].answer === true) {
                trueAnswers++;
            }
        }
        metricsObject.answered_true = trueAnswers;
        metricsObject.answered_false = answers.length - trueAnswers;
        metricsObject.answered_true_percentage = Math.round((metricsObject.answered_true / answers.length) * 100 * 100) / 100;
        metricsObject.answered_false_percentage = 100 - metricsObject.answered_true_percentage;
        ; res.status(200).json({
            success: true,
            total_answers: answers.length,
            answered_true: metricsObject.answered_true,
            answered_false: metricsObject.answered_false,
            answered_true_percentage: metricsObject.answered_true_percentage + '%',
            answered_false_percentage: metricsObject.answered_false_percentage + '%'
        });
    } catch (err) {
        res.status(400).json({ success: false, error: `${err.name} : wrong id format` })
    }
});