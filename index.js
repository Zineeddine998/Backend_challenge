const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const surveys = require('./routes/surveys');

const app = express();

// Logging for development environments
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('dev'));
}

app.use('/api/v1/surveys', surveys);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`));