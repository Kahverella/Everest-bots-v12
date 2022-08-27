let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let haftalikMission = new Schema({
    userID: String,
    Mission: { type: Object, default: []},
    Check: { type: Number, default: 0},
    Time: {type: Number}

});

module.exports = mongoose.model("haftalikMission", haftalikMission)