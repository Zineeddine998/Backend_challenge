const express = require('express');
const Entry = require('../models/Entry');
const { protectRoute } = require('../middleware/authentication');
const searchWrapper = require('../middleware/searchWrapper');


const {
    getEntries,
    getEntry,
    getEntriesBySurvey } = require('../controllers/entries');

const router = express.Router();

router.route('/').get(protectRoute, searchWrapper(Entry, 'answers'), getEntries);
router.route('/:id').get(protectRoute, getEntry);
router.route('/survey/:id').get(protectRoute, getEntriesBySurvey);

module.exports = router;
