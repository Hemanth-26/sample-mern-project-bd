const mongoose = require('mongoose');

async function databaseConnection () {
    const mongoUrl = "mongodb://127.0.0.1:27017/";
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUrl, { dbName: "sample"});
}

module.exports = databaseConnection;