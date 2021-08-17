//@desc Get all surveys
//@route GET /api/v1/surveys
//@access Public
exports.getSurveys = (req, res, next) => {
    res.status(200).json({ success: true, message: 'get all surveys' });
}

//@desc Get survey by id
//@route GET /api/v1/surveys/:id
//@access Public
exports.getSurvey = (req, res, next) => {
    res.status(200).json({ success: true, message: `Get survey with the id ${req.params.id}` });
}


//@desc Create a survey
//@route POST /api/v1/surveys/
//@access Public
exports.createSurvey = (req, res, next) => {
    res.status(200).json({ success: true, message: `Create Survey ${req.params.id}` });
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