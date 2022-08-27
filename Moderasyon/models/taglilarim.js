let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let taglilarim = Schema({
    Tarih: {type: Number, default: Date.now()},
    userID: {type: String, default: ""},
    authorID: {type: String, default: ""},
});

module.exports = mongoose.model("taglilarim", taglilarim)