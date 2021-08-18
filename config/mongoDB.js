const mongoose = require('mongoose');

function connect() {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        }).then((res, err) => {
            if (err) return reject(err);
            resolve();
        })
    });

}

function close() {
    return mongoose.disconnect();
}

module.exports = { connect, close };