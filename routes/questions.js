const express = require('express');
const Question = require('../models/Question');
const { protectRoute } = require('../middleware/authentication');
const searchWrapper = require('../middleware/searchWrapper');


const { getQuestion,
    getQuestions,
    updateQuestion,
    uploadImageQuestion,
    getQuestionsBySurvey,
    getQuestionStats } = require('../controllers/questions');

const router = express.Router();
router.route('/').get(searchWrapper(Question), getQuestions);
router.route('/:id/stats').get(protectRoute, getQuestionStats);
router.route('/:id/image').put(uploadImageQuestion);
router.route('/survey/:id').get(getQuestionsBySurvey);
router.route('/:id').get(getQuestion).put(protectRoute, updateQuestion);

module.exports = router;
