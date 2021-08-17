const mongoose = require('mongoose');

const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

    console.log(`Initiate connection with mongodb instance: ${connection.connection.host}`)
}

module.exports = connectDB;