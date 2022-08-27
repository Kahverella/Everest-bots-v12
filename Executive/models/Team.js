let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let Teams = Schema({
    tag: String,
    ticket: String,
    trole: String,
    created: Number
})

module.exports = mongoose.model("Team", Teams);