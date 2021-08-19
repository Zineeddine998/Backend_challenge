const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const rfs = require('rotating-file-stream');
const db = require('./config/mongoDB');
const { configCloudinary } = require('./utils/cloudinary');
const surveys = require('./routes/surveys');
const questions = require('./routes/questions');
const entries = require('./routes/entries');
const adminAuthentication = require('./routes/adminAuthentication');

dotenv.config({ path: './config/config.env' });
configCloudinary();
const app = express();
app.use(express.json());

// Logging for development environments
app.use(morgan(process.env.REQUEST_LOG_FORMAT || 'dev', {
    stream: process.env.REQUEST_LOG_FILE ?
        rfs.createStream(process.env.REQUEST_LOG_FILE, {
            size: '10M',
            // rotate every 10 MegaBytes written
            interval: '1d', // rotate daily
            compress: 'gzip' // compress rotated files
        })
        : porcess.stdout
}));

app.use(fileupload());
app.use(cookieParser());

app.use('/api/v1/surveys', surveys);
app.use('/api/v1/entries', entries);
app.use('/api/v1/questions', questions);
app.use('/api/v1/auth', adminAuthentication);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
db.connect();
const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`));
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`);
    server.close((() => process.exit(1)));
})

module.exports = app;

