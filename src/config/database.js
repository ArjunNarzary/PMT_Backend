const mongoose = require("mongoose");

exports.connectDatabase = () => {
    mongoose.connect(process.env.DB_URL).then(() => {
        console.log("Database connected");
    }).catch((error) => {
        console.log(error);
    });
};
