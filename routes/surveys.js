const express = require('express');
const router = express.Router();


const { getSurveys, getSurvey, takeSurvey, createSurvey, updateSurvey, deleteSurvey } = require('../controllers/surveys');

router.route('/').get(getSurveys).post(createSurvey);
router.route('/take/:id').post(takeSurvey);
router.route('/:id').get(getSurvey).put(updateSurvey).delete(deleteSurvey);

module.exports = router;
