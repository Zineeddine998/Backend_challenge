const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Question must have a text'],
        maxLength: [500, "Question must have at most 500 characters"]
    },
    answer: {
        type: Boolean,
        required: [true, 'Question must have an answer'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Question', QuestionSchema);