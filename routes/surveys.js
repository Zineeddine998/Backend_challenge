const express = require('express');
const router = express.Router();
const { getSurveys,
    getSurvey,
    takeSurvey,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    getSurveyStats
} = require('../controllers/surveys');
const searchWrapper = require('../middleware/searchWrapper');
const { protectRoute } = require('../middleware/authentication');
const Survey = require('../models/Survey');

router.route('/').get(searchWrapper(Survey, 'questions'), getSurveys).post(createSurvey);
router.route('/:id/stats').get(protectRoute, getSurveyStats);
router.route('/take/:id').post(takeSurvey);
router.route('/:id').get(getSurvey).put(protectRoute, updateSurvey).delete(protectRoute, deleteSurvey);

module.exports = router;
