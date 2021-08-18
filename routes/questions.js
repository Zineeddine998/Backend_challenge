const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/authentication');

const { getQuestion, getQuestions, deleteQuestion, updateQuestion } = require('../controllers/questions');

router.route('/').get(getQuestions);
router.route('/:id').get(getQuestion).delete(protectRoute, deleteQuestion).put(protectRoute, updateQuestion);

module.exports = router;
