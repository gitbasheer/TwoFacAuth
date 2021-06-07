const mongoose = require("mongoose");
const user = new  mongoose.Schema({
    username: String,
    password: String,
    secret: String,
    userId: String,
    qr: String
});

module.exports = mongoose.model("user1", user);