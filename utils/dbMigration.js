// Utility funtion to clean and populate database for testing purposes
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });


const Survey = require('../models/Survey');
const Question = require('../models/Question');


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const sample_data = JSON.parse(fs.readFileSync(`${__dirname}/sample_data.json`, 'utf8'));

// Import sample data to the database

const importData = async () => {
    try {
        await Survey.create(sample_data.Surveys);
        await Question.create(sample_data.Questions);
        console.log("data imported");
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(0);
    }
}

// Clean database

const deleteData = async () => {
    try {
        await Survey.deleteMany();
        await Question.deleteMany();
        console.log("data deleted");
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(0);

    }
}

if (process.argv[2] == '-add') {
    importData();
} else if (process.argv[2] == '-clean') {
    deleteData();
}