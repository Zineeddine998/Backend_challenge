const mongoose = require('mongoose');
const Answer = require('./Answer');

const EntrySchema = new mongoose.Schema({
    answers: {
        type: [{

            type: mongoose.Schema.Types.ObjectId,
            ref: 'Answer'

        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

EntrySchema.pre('remove', async function (next) {
    const listOfAnswers = this.questions;
    await listOfAnswers.map(async answer => {
        await Question.findByIdAndDelete(question._id)
    })
    next();
})
// // SurveySchema.virtual('questions', {
// //     ref: 'Qestion',
// //     localField: '_id',
// //     foreignField: 'quetion',
// //     justOne: false,
// // })

module.exports = mongoose.model('Entry', EntrySchema);


