let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let serverSettings = Schema({
    guildID: {
        type: String,
        default: ""
    },
    ETKINLIK: {
        type: String,
        default: ""
    },
    CEKILIS: {
        type: String,
        default: ""
    },
    
    ALONE: {
        type: String,
        default: ""
    },
    LOVERS: {
        type: String,
        default: ""
    },

    BALIK: {
        type: String,
        default: ""
    },
    KOVA: {
        type: String,
        default: ""
    },
    OGLAK: {
        type: String,
        default: ""
    },
    YAY: {
        type: String,
        default: ""
    },
    AKREP: {
        type: String,
        default: ""
    },
    TERAZI: {
        type: String,
        default: ""
    },
    BASAK: {
        type: String,
        default: ""
    },
    ASLAN: {
        type: String,
        default: ""
    },
    YENGEC: {
        type: String,
        default: ""
    },
    IKIZLER: {
        type: String,
        default: ""
    },
    BOGA: {
        type: String,
        default: ""
    },
    KOC: {
        type: String,
        default: ""
    },
})

module.exports = mongoose.model("eventkurulum", serverSettings);