const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const voiceStatsSchema = Schema({

    guildID: String,
    userID: String,
    
    yedi: {type: Object, default: {Id: "",coldown:""}},

 

});

module.exports = mongoose.model("coldown", voiceStatsSchema);