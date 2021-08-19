const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    answer: {
        type: Boolean,
        required: [true, 'Question must have an answer'],
    },
    text: {
        type: String,
        required: [true, 'Question must have a text'],
        maxLength: [500, "Question must have at most 500 characters"]
    },
    question: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: true
    }
});

module.exports = mongoose.model('Answer', AnswerSchema);