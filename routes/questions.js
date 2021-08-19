const express = require('express');
const Question = require('../models/Question');
const router = express.Router();
const { protectRoute } = require('../middleware/authentication');
const searchWrapper = require('../middleware/searchWrapper');


const { getQuestion, getQuestions, updateQuestion, uploadImageQuestion, getQuestionsBySurvey } = require('../controllers/questions');

router.route('/').get(searchWrapper(Question), getQuestions);
router.route('/:id/image').put(uploadImageQuestion);
router.route('/survey/:id').get(getQuestionsBySurvey);
router.route('/:id').get(getQuestion).put(protectRoute, updateQuestion);

module.exports = router;
