const express = require('express');
const Answer = require('../models/Answer');
const router = express.Router();
const { protectRoute } = require('../middleware/authentication');
const searchWrapper = require('../middleware/searchWrapper');


const { getAnswers, getAnswer, getAnswersByQuestion } = require('../controllers/answers');

router.route('/').get(protectRoute, searchWrapper(Answer), getAnswers);
router.route('/question/:id').get(protectRoute, getAnswersByQuestion);
router.route('/:id').get(protectRoute, getAnswer);

module.exports = router;
