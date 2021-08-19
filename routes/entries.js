const express = require('express');
const Entry = require('../models/Entry');
const router = express.Router();
const { protectRoute } = require('../middleware/authentication');
const searchWrapper = require('../middleware/searchWrapper');


const { getEntries, getEntry, getEntriesBySurvey } = require('../controllers/entries');

router.route('/').get(searchWrapper(Entry, 'answers'), getEntries);
router.route('/:id').get(getEntry);
router.route('/surveys/:id').get(getEntriesBySurvey);

module.exports = router;
