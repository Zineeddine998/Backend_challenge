const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Entry = require('../models/Entry');
const Survey = require('../models/Survey');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc Get all entries
//@route GET /api/v1/entries
//@access Public
exports.getEntries = async (req, res, next) => {
    res.status(200).json(res.searchWrapper);
}
//@desc Get a single entry
//@route GET /api/v1/entries/:id
//@access Public
exports.getEntry = async (req, res, next) => {
    try {
        const entry = await Entry.findById(req.params.id).populate('answers');
        if (!entry) {
            return next(
                new ErrorResponse(`No entry with the id of ${req.params.id}`,
                    404
                ));
        }
        res.status(200).json({ success: true, data: entry });
    } catch (err) {
        res.status(400).json({ success: false, error: "Wrong request format" });
    }
}

// //@desc delete a single entry
// //@route DELETE /api/v1/entries/:id
// //@access Private
// exports.deleteEntry = asyncHandler(async (req, res, next) => {
//     let question = await Question.findById(req.params.id);
//     if (!question) {
//         return next(
//             new ErrorResponse(`No question with the id of ${req.params.id}`,
//                 404
//             ));
//     }
//     await question.remove();
//     res.status(200).json({
//         success: true,
//         data: {}
//     })
// });

// //@desc update a single question
// //@route UPDATE /api/v1/questions/:id
// //@access Private
// exports.updateEntry = asyncHandler(async (req, res, next) => {
//     let question = await Question.findById(req.params.id);
//     if (!question) {
//         return next(
//             new ErrorResponse(`No question with the id of ${req.params.id}`,
//                 404
//             ));
//     }
//     question = await Question.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     });
//     res.status(200).json({
//         success: true,
//         data: question
//     })
// });


//@desc Get all entries of a survey
//@route GET /api/v1/entries/survey/:id
//@access Public
exports.getEntriesBySurvey = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(
            new ErrorResponse(`Missing id field`,
                400
            ));
    }
    try {
        const survey = await Survey.findById(id);
        if (!survey) {
            return next(
                new ErrorResponse(`No survey with the id of ${id}`,
                    404
                ));
        }
        const entries = survey.entries;
        const surveyFormat = [];
        for (let i = 0; i < entries.length; i++) {
            let answers = await Entry.findById(entries[i]).populate({
                path : 'answers',
                select : 'text answer'
            });
            surveyFormat.push(answers);
        };
        if (!surveyFormat) {
            return next(
                new ErrorResponse(`No survey with the id of ${req.params.id}`,
                    404)
            );
        }

        res.status(200).json({ success: true, count: surveyFormat.length, data: surveyFormat });
    } catch (err) {
        res.status(400).json({ success: false, error: `${err.name} : wrong id format` })
    }
});