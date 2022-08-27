let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let data = Schema({
        guildID: String,
        roller: Array,
})

module.exports = mongoose.model("dr", data);