let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let data = Schema({
        guildID: String,
        komutAd: String,
        verilcekRol: Array,
        roller: Array,
        kisiler: Array,
        sorumluluk: Array
})

module.exports = mongoose.model("specialcommands", data);