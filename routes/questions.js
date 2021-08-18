const express = require('express');
const Question = require('../models/Question');
const router = express.Router();
const { protectRoute } = require('../middleware/authentication');
const searchWrapper = require('../middleware/searchWrapper');


const { getQuestion, getQuestions, deleteQuestion, updateQuestion, uploadImageQuestion } = require('../controllers/questions');

router.route('/').get(searchWrapper(Question), getQuestions);
router.route('/:id/image').put(uploadImageQuestion);
router.route('/:id').get(getQuestion).delete(protectRoute, deleteQuestion).put(protectRoute, updateQuestion);

module.exports = router;
