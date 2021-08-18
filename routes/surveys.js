const express = require('express');
const router = express.Router();
const { getSurveys,
    getSurvey,
    takeSurvey,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    getQuestionsBySurvey,
    addQuestionToSurvey,
    removeQuestionFromSurvey,
    addManyQuestionsToSurvey,
} = require('../controllers/surveys');
const searchWrapper = require('../middleware/searchWrapper');
const Survey = require('../models/Survey');

router.route('/').get(searchWrapper(Survey, 'questions'), getSurveys).post(createSurvey);
router.route('/take/:id').post(takeSurvey);
router.route('/:id/many/questions').put(addManyQuestionsToSurvey)
router.route('/:ids/questions/:idq').put(removeQuestionFromSurvey);
router.route('/:id/questions').get(getQuestionsBySurvey).put(addQuestionToSurvey);
router.route('/:id').get(getSurvey).put(updateSurvey).delete(deleteSurvey);

module.exports = router;
