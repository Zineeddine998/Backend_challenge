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
    const listOfAnswers = this.answers;
    await listOfAnswers.map(async answer => {
        await Answer.findByIdAndDelete(answer._id)
    })
    next();
})


module.exports = mongoose.model('Entry', EntrySchema);


