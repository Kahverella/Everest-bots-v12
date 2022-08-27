const mongoose = require('mongoose');
let client = global.client;
let puansystem = mongoose.Schema({
    guildID: String,
    PublicKanallar: {
        type: Object,
        default: {
            "Rol": [],
            "Id": [],
            "Puan": 60
        }
    },
    GameKanallar: {
        type: Object,
        default: {
            "Rol": [],
            "Id": [],
            "Puan": 30
        }
    },
    KayitKanallar: {
        type: Object,
        default: {
            "Rol": [],
            "Id": [],
            "Puan": 50
        }
    },
    StreamKanallar: {
        type: Object,
        default: {
            "Rol": [],
            "Id": [],
            "Puan": 45
        }
    },
    SecretKanallar: {
        type: Object,
        default: {
            "Rol": [],
            "Id": [],
            "Puan": 10
        }
    },
    SleepingKanal: {
        type: Object,
        default: {
            "Rol": [],
            "Id": "",
            "Puan": 25
        }
    },
    AloneKanallar: {
        type: Object,
        default: {
            "Rol": [],
            "Id": [],
            "Puan": 25
        }
    },
    TerapiKanallar: {
        type: Object,
        default: {
            "Rol": [],
            "Id": [],
            "Puan": 15
        }
    },
    SorunCozmeKanallar: {
        type: Object,
        default: {
            "Rol": [],
            "Id": [],
            "Puan": 15
        }
    },
    MesajKanallar: {
        type: Object,
        default: {
            "Rol": [],
            "Id": [],
            "Puan": 1
        }
    },
    TagMember: {
        type: Object,
        default: {
            "Rol": [],
            "Puan": 40
        }
    },
    Invite: {
        type: Object,
        default: {
            "Rol": [],
            "Puan": 30
        }
    },
    Register: {
        type: Object,
        default: {
            "Rol": [],
            "Puan": 15
        }
    },
    Yetkili: {
        type: Object,
        default: {
            "Rol": [],
            "Puan": 150
        }
    },
    Toplantı: {
        type: Object,
        default: {
            "Rol": [],
            "Id": [],
            "Puan": 20
        }
    },
    Müzik: {
        type: Object,
        default: {
            "Rol": [],
            "Id": [],
            "Puan": 6
        }
    },
    DailyMission: {
        type: Object,
        default: {
            "logChannel": "",
            "category": [],
            "messageChannel": [],
            "unChannel": []
        }
    },
    AutoRankUP: {
        type: Object,
        default: {
            Type: false,
            LogChannel: ""
        }
    },
    LevelSystem: {
        type: Object,
        default: {
            Type: false,
            LogChannel: ""
        }
    },
    PuanRolSystem: {
        type: Array,
        default: []
    },
    AutoLogin: {
        type: Object,
        default: {
            Type: true
        }
    }
});
module.exports = mongoose.model("puansystem", puansystem)