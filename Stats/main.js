const Discord = require('discord.js');
const client = global.client = new Discord.Client();
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const random = require("random");
const profilManager = require("./models/profilmanager")
const pretty = require("pretty-ms");
moment.locale("tr");
let mainSettings = require(__dirname + "/../settings.js");
let mongoose = require("mongoose");
mongoose.connect(mainSettings.MongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
const sunucuayar = require('./models/sunucuayar');
let randMiss = require("./models/randomMission");
let easyMiss = require("./models/easyMission");
let haftalıkMiss = require("./models/haftalıkmissions");

let puansystem = require("./models/puansystem");
client.db = require("./models/özelperm");
let stats = require("./models/stats");
require('./util/eventLoader')(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir(__dirname + '/komutlar/', (err, files) => {
  if (err) console.error(err);
  files.forEach(f => {
    fs.readdir(__dirname + "/komutlar/" + f, (err2, files2) => {
      files2.forEach(file => {
        let props = require(`./komutlar/${f}/` + file);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.help.name);
        });
      })
    })
  });
});

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-.]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.ayarlar = {
	"prefix": mainSettings.prefix,
	"botSesID": mainSettings.botSesID,
	"sunucuId": mainSettings.sunucuId,
	"sahip": mainSettings.sahip,
  "tag": mainSettings.tag,
  "sunucuAdı": mainSettings.sunucuAdı,
	"commandChannel": mainSettings.commandChannel,
	
	"CHAT_KANAL": mainSettings.CHAT_KANAL,
	"PUBLIC_KATEGORI": mainSettings.PUBLIC_KATEGORI,
	"STREAMER_KATEGORI":mainSettings.STREAMER_KATEGORI,
	"REGISTER_KATEGORI": mainSettings.REGISTER_KATEGORI,
	"SLEEP_ROOM": mainSettings.SLEEP_ROOM,
	
	"footer": mainSettings.footer,
	"onsekizatilacakoda": mainSettings.onsekizatilacakoda,
	"onsekizodalar": mainSettings.onsekizodalar,
	"readyFooter": mainSettings.readyFooter,
	"chatMesajı": mainSettings.chatMesajı,
	"YETKI_VER_LOG": mainSettings.YETKI_VER_LOG,
	"CEZA_PUAN_KANAL": mainSettings.CEZA_PUAN_KANAL,
	"taglogkanal": mainSettings.TAG_SYSTEM_CHANNEL,
	"CEZA_PUAN_SYSTEM": mainSettings.CEZA_PUAN_SYSTEM
}
const ayarlar = client.ayarlar
global.ayarlar = ayarlar;

client.login(mainSettings.STATS).catch(() => console.log("Token bozulmuş lütfen yeni bir token girmeyi dene"));
client.emoji = function (x) {
  return client.emojis.cache.find(x => x.name === client.emojiler[x]);
};

client.channelTime = new Map();

client.yolla = async (mesaj, msg, kanal) => {
  if (!mesaj || typeof mesaj !== "string") return
  const embd = new Discord.MessageEmbed()
    .setAuthor(msg.tag, msg.displayAvatarURL({ dynamic: true }))
    .setColor("RANDOM")
    .setDescription(mesaj)
  kanal.send(embd).catch(console.error);
}

client.turkishDate = async (date) => {
  if (!date || typeof date !== "number") return
  let convert = pretty(date, { verbose: true })
    .replace("minutes", "dakika")
    .replace("minute", "dakika")
    .replace("hours", "saat")
    .replace("hour", "saat")
    .replace("seconds", "saniye")
    .replace("second", "saniye")
    .replace("days", "gün")
    .replace("day", "gün")
    .replace("years", "yıl")
    .replace("year", "yıl");
  return convert
}

client.emojiler = {
  onay: "sea27",
  iptal: "sea20",
  cevrimici: "kck_online",
  rahatsizetmeyin: "kck_dnd",
  bosta: "kck_away",
  gorunmez: "kck_offline",
  erkekEmoji: "kck_man",
  kizEmoji: "kck_woman",
  sagEmoji: "kck_sag",
  tikEmoji: "kck_tik",
  aktifEmoji: "kck_acik",
  deaktifEmoji: "kck_kapali",
  muteEmoji: "kck_muted",
  unmuteEmoji: "kck_unmuted",
  deafnedEmoji: "kck_deafned",
  undeafnedEmoji: "kck_undeafned"
};

global.emoji = client.emoji = function (x) {
  return client.emojis.cache.find(x => x.name === client.emojiler[x]);
};

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (oldState.member.user.bot) return;
  const data = await profilManager.findOne({ user: oldState.id, guild: oldState.guild.id }) || {
    level: { message: { xp: 0, level: 0, totalXp: 0, lastMessage: 0 }, voice: { xp: 0, level: 0, totalXp: 0, lastVoice: 0 } }
  };
  const guild = await sunucuayar.findOne({ guildID: oldState.guild.id }) || { levelSystem: { voice: { }, message: { } }}
  let xpAdd = random.int(15, 55);
  let xpToNextLevel = 5 * Math.pow((data?.level?.voice?.level || 0), 2) + 50 * (data?.level?.voice?.level || 0) + 100;
  const levels = Object.keys((guild?.levelSystem?.voice || {})).sort((a,b) => b-a);
  const currentLevel = levels.find(level => data?.level?.voice?.level == level);
  const oldRole = levels.filter(level => level != currentLevel);

  if (levels.length > 0 && currentLevel && data?.level?.voice?.level == currentLevel) {
    if (oldRole.length > 0) {
      for (const rol of oldRole) {
        let _rol = guild.levelSystem.voice[rol];
        if (oldState.member.roles.cache.get(_rol)) {
          oldState.member.roles.remove(_rol);
        };
      };
    };
    if (!oldState.member.roles.cache.get(guild.levelSystem.voice[currentLevel])) {
      await oldState.member.roles.add(guild.levelSystem.voice[currentLevel]);
    };
  };

  if (data?.level?.voice?.xp >= xpToNextLevel) { 
    await profilManager.updateOne({ user: oldState.id, guild: oldState.guild.id }, {
      $inc: { ["level.voice.level"]: 1 },
      $set: {
        [`level.voice.lastVoice`]: Date.now(),
        ["level.voice.xp"]: 0
      }
    }, { upsert: true });
  };

  //#region Voice Join
  if (!oldState.channel && newState.channel) {
    await profilManager.updateOne({ user: oldState.id, guild: oldState.guild.id}, {
      $set: {
        [`level.voice.lastVoice`]: Date.now()
      }
    }, { upsert: true });
  };
  //#endregion
  //#region Voice Leave
  if (oldState.channel && !newState.channel) {
    const last = Date.now() - data?.level?.voice?.lastVoice || 0;
    const addXp = (last / (1000 * 60 * 60)) * xpAdd;
    await profilManager.updateOne({ user: oldState.id, guild: oldState.guild.id }, {
      $inc: {
        [`level.voice.xp`]: addXp,
        [`level.voice.totalXp`]: addXp
      },
      $set: {
        [`level.voice.lastVoice`]: Date.now()
      }
    }, { upsert: true });
  };
  //#endregion
  //#region Voice Switch
  if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
    const last = Date.now() - data?.level?.voice?.lastVoice || 0;
    const addXp = (last / (1000 * 60 * 60)) * xpAdd;
    await profilManager.updateOne({ user: oldState.id, guild: oldState.guild.id }, {
      $inc: {
        [`level.voice.xp`]: addXp,
        [`level.voice.totalXp`]: addXp
      },
      $set: {
        [`level.voice.lastVoice`]: Date.now()
      }
    }, { upsert: true });
  };
});

client.on("message", async (message) => {
  if (message.author.bot || message.content.startsWith(".")) return;
  let data = await profilManager.findOne({ user: message.author.id, guild: message.guild.id });
  const guild = await sunucuayar.findOne({ guildID: message.guild.id }) || { levelSystem: {} };
  if (!data && !data?.level?.message && !data?.level?.message) data = {
    level: { message: { xp: 0, level: 0, totalXp: 0, lastMessage: 0 }, voice: { xp: 0, level: 0, totalXp: 0,lastVoice: 0 } }
  };
  let xpAdd = random.int(15, 25);
  let xpToNextLevel = 5 * Math.pow((data?.level?.message?.level || 0), 2) + 50 * (data?.level?.message?.level || 0) + 100;
  if (Date.now() - (data?.level?.message?.lastMessage || 0) > 1000 * 60) {
    const levels = Object.keys((guild?.levelSystem?.message || {})).sort((a, b) => b - a);
    const currentLevel = levels.find(level => data?.level?.message?.level == level);
    const oldRole = levels.filter(level => level != currentLevel);
    if (levels.length > 0 && currentLevel && data?.level?.message?.level == currentLevel) {
      if (oldRole.length > 0) {
        for (const rol of oldRole) {
          let _rol = guild.levelSystem.message[rol];
          if (message.member.roles.cache.get(_rol)) {
            message.member.roles.remove(_rol);
          };
        };
      };
      if (!message.member.roles.cache.get(guild.levelSystem.message[currentLevel])) {
        await message.member.roles.add(guild.levelSystem.message[currentLevel]);
      };
    };
    if (data?.level?.message?.xp >= xpToNextLevel) {
      await profilManager.updateOne({ user: message.author.id, guild: message.guild.id }, {
        $inc: {
          ["level.message.level"]: 1,
        },
        $set: {
          ["level.message.lastMessage"]: Date.now(),
          ["level.message.xp"]: (data?.level?.message?.xp - xpToNextLevel)
        }
      }, { upsert: true });
    };
    await profilManager.updateOne({ user: message.author.id, guild: message.guild.id }, {
      $inc: {
        ["level.message.xp"]: xpAdd,
        ["level.message.totalXp"]: xpAdd
      },
      $set: {
        ["level.message.lastMessage"]: Date.now()
      }
    }, { upsert: true });
  };
});

client.convertDuration = (date) => {
  return moment.duration(date).format('H [saat,] m [dk.]');
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
};

Array.prototype.temizle = function () {
  let yeni = [];
  for (let i of this) {
    if (!yeni.includes(i)) yeni.push(i);
  }
  return yeni;
};

client.savePunishment = async () => {
  sunucuayar.findOne({}, async (res) => {
    if (!res) return
    res.WARNID = res.WARNID + 1
    res.save().catch(e => console.log(e))
  })
}

client.dailyMission = async function (userID, type, value) {
    randMiss.findOne({ userID: userID }, async (data) => {
      if (!data) return;
      if (data.Mission.MISSION == type) {
        data.Check += value;
        data.save()
      }
    })
}
client.easyMission = async function(userID, type, value) {
  easyMiss.findOne({ userID: userID }, async (data) => {
    if (!data) return;
    if (data.Mission.Type == type) {
      data.Check+=value;data.save()
    }
  })
}
client.haftalıkMission = async function(userID, type, value) {
  haftalıkMiss.findOne({ userID: userID }, async (data) => {
    if (!data) return;
    if (data.Mission.Type == type) {
      data.Check+=value;data.save()
    }
  })
}


let arr = [{
  Chat: "💬🥉",
  Voice: "🔊🥉",
  ChatColor: "#fa795b",
  VoiceColor: "#fa795b",
  sLevel: 3,
  cLevel: 2
}, {
  Chat: "💬🥈",
  Voice: "🔊🥈",
  ChatColor: "#cfcbcb",
  VoiceColor: "#cfcbcb",
  sLevel: 8,
  cLevel: 5
}, {
  Chat: "💬🥇",
  Voice: "🔊🥇",
  ChatColor: "#fffb00",
  VoiceColor: "#fffb00",
  sLevel: 20,
  cLevel: 35
}, {
  Chat: "💬🏆",
  Voice: "🔊🏆",
  ChatColor: "#23fafa",
  VoiceColor: "#23fafa",
  sLevel: 50,
  cLevel: 70
}]
client.checkLevel = async function (userID, guildID, type) {
  let levelKontrol = await puansystem.findOne({ guildID: guildID }) || { LevelSystem: { Type: false, LogChannel: null } };
  if (levelKontrol.LevelSystem.Type == false) return;
  let sunucu = client.guilds.cache.get(guildID);
  if (!sunucu) return;
  let kontrol = await stats.findOne({ userID: userID, guildID: guildID });
  if (!kontrol) return;
  arr.map(async data => {
    if (type === "mesaj") {
      if (kontrol.messageLevel >= data.cLevel) {
        if (kontrol.autoRankup.includes(data.Chat)) return;
        stats.updateOne({ userID: userID, guildID: guildID }, { $push: { autoRankup: data.Chat } }, { upsert: true }).exec()
        client.channels.cache.get(levelKontrol.LevelSystem.LogChannel).send(`:tada: <@${userID}> tebrikler! Mesaj istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **"${data.Chat}"** rolüne terfi edildin!`)
      };
    };
    if (type === "ses") {
      if (kontrol.voiceLevel >= data.sLevel) {
        if (kontrol.autoRankup.includes(data.Voice)) return;
        stats.updateOne({ userID: userID, guildID: guildID }, { $push: { autoRankup: data.Voice } }, { upsert: true }).exec()
        client.channels.cache.get(levelKontrol.LevelSystem.LogChannel).send(`:tada: <@${userID}> tebrikler! Ses istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **"${data.Voice}"** rolüne terfi edildin!`)
      };
    };
  });
};