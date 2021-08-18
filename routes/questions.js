const express = require('express');
const router = express.Router();


const { getQuestion, getQuestions, deleteQuestion, updateQuestion } = require('../controllers/questions');

router.route('/').get(getQuestions);
router.route('/:id').get(getQuestion).delete(deleteQuestion).put(updateQuestion);

module.exports = router;
