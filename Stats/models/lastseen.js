let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let lastseen = Schema({
    userID: { type: String, default: "" },
    JoinTime: { type: Number, default: Date.now() },
    LeaveTime: { type: Number, default: Date.now() },
})

module.exports = mongoose.model("lastSeen", lastseen)