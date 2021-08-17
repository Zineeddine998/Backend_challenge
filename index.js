const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/mongoDB');

dotenv.config({ path: './config/config.env' });

const surveys = require('./routes/surveys');
const questions = require('./routes/questions');

const app = express();
app.use(express.json());
connectDB();

// Logging for development environments
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('dev'));
}

app.use('/api/v1/surveys', surveys);
app.use('/api/v1/questions', questions);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`));