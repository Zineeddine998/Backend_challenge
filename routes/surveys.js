const express = require('express');
const router = express.Router();
const { getSurveys, getSurvey, takeSurvey, createSurvey, updateSurvey, deleteSurvey, getQuestionsBySurvey } = require('../controllers/surveys');
const searchWrapper = require('../middleware/searchWrapper');
const Survey = require('../models/Survey');

router.route('/').get(searchWrapper(Survey, 'questions'), getSurveys).post(createSurvey);
router.route('/take/:id').post(takeSurvey);
router.route('/:id/questions').get(getQuestionsBySurvey);
router.route('/:id').get(getSurvey).put(updateSurvey).delete(deleteSurvey);

module.exports = router;
