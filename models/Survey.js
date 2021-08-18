const mongoose = require('mongoose');
const Question = require('./Question');

const SurveySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name to the survey"],
        maxLength: [70, 'Name of survey cannot exceed 70 characters']
    },
    description: {
        type: String,
        required: false,
        maxLength: [500, 'Description of the survey cannot exceed 500 characters']
    },
    questions: {
        type: [{

            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'

        }]
    }

});
SurveySchema.pre('remove', async function (next) {
    const listOfQuestions = this.questions;
    await listOfQuestions.map(async question => {
        await Question.findByIdAndDelete(question._id)
    })
    next();
})
// SurveySchema.virtual('questions', {
//     ref: 'Qestion',
//     localField: '_id',
//     foreignField: 'quetion',
//     justOne: false,
// })

module.exports = mongoose.model('Survey', SurveySchema);


