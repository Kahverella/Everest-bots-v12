const mongoose = require('mongoose');
let streamer = mongoose.Schema({
    user: { type: String }, 
    baslangic: { type: Date, default: null},
    channelName: {type: String},
    channelID: {type: String}
});
module.exports = mongoose.model("streamer", streamer);


