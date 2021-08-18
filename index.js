const express = require('express');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/mongoDB');
const { configCloudinary } = require('./utils/cloudinary');
const surveys = require('./routes/surveys');
const questions = require('./routes/questions');
const adminAuthentication = require('./routes/adminAuthentication');

dotenv.config({ path: './config/config.env' });
connectDB();
configCloudinary();
const app = express();
app.use(express.json());

// Logging for development environments
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('dev'));
}

app.use(fileupload());
app.use(cookieParser());

app.use('/api/v1/surveys', surveys);
app.use('/api/v1/questions', questions);
app.use('/api/v1/auth', adminAuthentication);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`.red);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
