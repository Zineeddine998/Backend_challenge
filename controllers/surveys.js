const Survey = require('../models/Survey');
const Question = require('../models/Question');

//@desc Get all surveys
//@route GET /api/v1/surveys
//@access Public
exports.getSurveys = async (req, res, next) => {
    try {
        const surveys = await Survey.find();
        res.status(200).json({ success: true, count: surveys.length, data: surveys });
    } catch (err) {
        res.status(400).json({ success: false })
    }
}

//@desc Get survey by id
//@route GET /api/v1/surveys/:id
//@access Public
exports.getSurvey = async (req, res, next) => {
    try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) {
            return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: survey });
    } catch (err) {
        res.status(400).json({ success: false })
    }
}


//@desc Create a survey
//@route POST /api/v1/surveys/
//@access Public
exports.createSurvey = async (req, res, next) => {

    try {
        if (!req.body.questions || !req.body.name) {
            res.status(400).json({ success: false, error: "no questions to be added to the survey" });
            next();
        }
        req.body.questions.map((index, question) => {
            if (!question.text || !question.answer)
                res.status(400).json({ success: false, error: `Question ${index} has missing fields` });
            next();
        });
        let newSurvey = await Survey.create({
            name: req.body.name,
            description: req.body.description ? req.body.description : undefined,
            questions: []
        });
        await req.body.questions.map((question) => {
            return Question.create(question).then(newQuestion => {
                return Survey.findByIdAndUpdate(
                    newSurvey._id,
                    { $push: { questions: newQuestion._id } },
                    { new: true, useFindAndModify: false }
                );
            });
        });
        res.status(400).json({ success: true, data: newSurvey });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message })
    }

}
//@desc Update a survey
//@route PUT /api/v1/survey/:id
//@access Private (Reserved to admin)
exports.updateSurvey = (req, res, next) => {
    res.status(200).json({ success: true, message: `Update Survey ${req.params.id}` });
}

//@desc Delete a Survey
//@route DELETE /api/v1/surveys/:id
//@access Private (Reserved for the admin)
exports.deleteSurvey = (req, res, next) => {
    res.status(200).json({ success: true, message: `Delete Survey ${req.params.id}` });
}

//@desc Take a Survey
//@route POST /api/v1/surveys/take/:id
//@access Public
exports.takeSurvey = (req, res, next) => {
    res.status(200).json({ success: true, message: `Take Survey ${req.params.id}` });
}