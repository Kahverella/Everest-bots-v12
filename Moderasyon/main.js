const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const client = global.client = new Discord.Client();
const disbut = require("discord-buttons");
require('discord-buttons')(client)
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
moment.locale("tr");

let mainSettings = require(__dirname + "/../settings.js");
let mongoose = require("mongoose");
mongoose.connect(mainSettings.MongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const sunucuayar = require('./models/sunucuayar');
client.db = require("./models/özelperm");
let randMiss = require("./models/randomMission");
let easyMiss = require("./models/easyMission");
let ozelKomut = require("./models/özelkomut");
let sorumluluk = require("./models/sorumluluk");
let yetkiDATA = require("./models/yetkili");

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
  "SPECIALROLES": mainSettings.OZELROL,
  "YETKI_VER_LOG": mainSettings.YETKI_VER_LOG,
  "CEZA_PUAN_KANAL": mainSettings.CEZA_PUAN_KANAL,
  "taglogkanal": mainSettings.TAG_SYSTEM_CHANNEL,
  "CEZA_PUAN_SYSTEM": mainSettings.CEZA_PUAN_SYSTEM,
}
const conf = client.ayarlar
global.conf = conf;

client.on("messageDelete", async (message) => {
  if (message.author.bot) return;
  client.snipe.set(message.channel.id, message)
})

client.emoji = function (x) {
  return client.emojis.cache.find(x => x.name === client.emojiler[x]);
};

client.emojiler = {
  onay: "kck_tik",
  iptal: "kck_iptal",
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

client.splitEmbedWithDesc = async function (description, author = false, footer = false, features = false) {
  let embedSize = parseInt(`${description.length/2048}`.split('.')[0]) + 1
  let embeds = new Array()
  for (var i = 0; i < embedSize; i++) {
    let desc = description.split("").splice(i * 2048, (i + 1) * 2048)
    let x = new MessageEmbed().setDescription(desc.join(""))
    if (i == 0 && author) x.setAuthor(author.name, author.icon ? author.icon : null)
    if (i == embedSize - 1 && footer) x.setFooter(footer.name, footer.icon ? footer.icon : null)
    if (i == embedSize - 1 && features && features["setTimestamp"]) x.setTimestamp(features["setTimestamp"])
    if (features) {
      let keys = Object.keys(features)
      keys.forEach(key => {
        if (key == "setTimestamp") return
        let value = features[key]
        if (i !== 0 && key == 'setColor') x[key](value[0])
        else if (i == 0) {
          if (value.length == 2) x[key](value[0], value[1])
          else x[key](value[0])
        }
      })
    }
    embeds.push(x)
  }
  return embeds
};

client.convertDuration = (date) => {
  return moment.duration(date).format('H [saat,] m [dakika]');
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
  sunucuayar.findOne({}, async (err, res) => {
    if (!res) return
    res.WARNID = res.WARNID + 1
    res.save().catch(e => console.log(e))
  })
}

client.Embed = async (kanal, message) => {

  let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setDescription(message)
  client.channels.cache.get(kanal).send(embed).then(message => message.delete({ timeout: 5000 }))
  return embed;
}

client.snipe = new Map();
client.on("message", async message => {
  if (!message.guild || message.channel.type === "dm") return;
  const prefixes = client.ayarlar.prefix;
  let prefix = prefixes.filter(p => message.content.startsWith(p))[0];
  if (!prefix) return;
  let sunucuData = await sunucuayar.findOne({ guildID: message.guild.id });
  let data = await ozelKomut.find({ guildID: message.guild.id }) || [];
  let data2 = await sorumluluk.find({ guildID: message.guild.id }) || [];
  let ozelkomutlar = data;
  let yazilanKomut = message.content.split(" ")[0];
  yazilanKomut = yazilanKomut.slice(prefix.length);
  var args = message.content.split(" ").slice(1);

  let komut = ozelkomutlar.find(command => command.komutAd.toLowerCase() === yazilanKomut);
  if (!komut) return;

  let verilenRol = message.guild.roles.cache.some(role => komut.verilcekRol.includes(role.id));
  if (!verilenRol) return;

  let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (message.member.roles.cache.some(rol => komut.roller.includes(rol.id)) || komut.kisiler.includes(message.author.id) || data2.some(veri => komut.sorumluluk.includes(veri)) || message.member.permissions.has(8)) {
    if (!üye) return message.reply(`rolünü verileceği/alınacağı üyeyi etiketlemelisin!`)
    console.log(komut.verilcekRol)
    if(üye.roles.cache.some(rol => komut.verilcekRol.includes(rol.id))) {
  if (komut.YetkiliROL === true && üye.user.username.includes(sunucuData.TAG)) {
        client.channels.cache.get(mainSettings.YETKI_VER_LOG).send(new MessageEmbed().setColor("RANDOM").setTimestamp().setDescription(`${üye} üyesinden ${komut.verilcekRol.map(x => `<@&${x}>`)} yetkileri alındı! - Yetkiyi Alan: ${message.author} (\`${message.author.id}\`) - ${moment(Date.now()).locale("tr").format("LLL")}`))
        üye.roles.remove(komut.verilcekRol).then(a => message.channel.send(new MessageEmbed().setColor("RANDOM").setDescription(`${üye} üyesinden ${komut.verilcekRol.map(x => `<@&${x}>`)} yetkileri alındı!`)))
		await yetkiDATA.deleteMany({userID: üye.id});
        await ozelKomut.updateOne({guildID: message.guild.id, komutAd: komut.komutAd}, {$pull: {YetkiliData: {Target: üye.id}}}).exec();
      } if (komut.YetkiliROL === false) {
        return üye.roles.remove(komut.verilcekRol).then(a => message.channel.send(new MessageEmbed().setColor("RANDOM").setDescription(`${üye} üyesinden ${komut.verilcekRol.map(x => `<@&${x}>`)} rolü alındı!`)))      
      } else return;
    } else {
      if (komut.YetkiliROL === true && üye.user.username.includes(sunucuData.TAG)) {
        await yetkiDATA.findOne({ userID: üye.id, Durum: "stat" }, async (err, res) => {
          if (!res) {
            let newData = new yetkiDATA({ userID: üye.id, authorID: "x", Tarih: Date.now(), Durum: "stat" });
            newData.save();
          }
        })
        await yetkiDATA.findOne({ userID: üye.id, Durum: "puan" }, async (err, res) => {
          if (!res) {
            let newData = new yetkiDATA({ userID: üye.id, authorID: "x", Tarih: Date.now(), Durum: "puan" });
            newData.save();
          }
        })
        client.channels.cache.get(mainSettings.YETKI_VER_LOG).send(new MessageEmbed().setColor("RANDOM").setTimestamp().setDescription(`${üye} üyesine ${komut.verilcekRol.map(x => `<@&${x}>`)} yetkileri verildi! - Yetkiyi Veren: ${message.author} (\`${message.author.id}\`) - ${moment(Date.now()).locale("tr").format("LLL")}`))
        üye.roles.add(komut.verilcekRol).then(() => message.channel.send(new MessageEmbed().setColor("RANDOM").setDescription(`${üye} üyesine ${komut.verilcekRol.map(x => `<@&${x}>`)} yetkileri verildi!`)))
        return await ozelKomut.updateOne({ guildID: message.guild.id, komutAd: komut.komutAd }, { $push: { YetkiliData: {Author: message.author.id, Target: üye.id,TargetName: üye.displayName, Tarih: Date.now(), VerilenYetki: komut.verilcekRol }}}).exec();
      } else if (komut.YetkiliROL === false) {
        message.channel.send(new MessageEmbed().setColor("RANDOM").setDescription(`${üye} üyesine ${komut.verilcekRol.map(x => `<@&${x}>`)} rolü verildi!`))
        return üye.roles.add(komut.verilcekRol)
      } else return;
    };
  } else return;
});

client.rolVer = async function (userID, rolArray, authorID, yetkiliArray, mesajChannel, guildID) {
  let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(client.ayarlar.footer)
    .setAuthor(client.users.cache.get(authorID).username, client.guilds.cache.get(guildID).members.cache.get(authorID).user.displayAvatarURL({ dynamic: true }))
  if (authorID.roles.cache.some(rol => yetkiliArray.some(rol2 => rol == rol2))) {
    if (userID.roles.cache.some(rol => rolArray.some(rol2 => rol == rol2))) {
      client.channels.cache.get(mesajChannel).send(embed.setDescription(`${userID} adlı kullanıcıdan ${rolArray.map(x => `<@${x}>`)} rolünü aldım`)).catch(() => {})
      userID.roles.remove(rolArray).catch(() => {})
    }; 
    client.channels.cache.get(mesajChannel).send(embed.setDescription(`${userID} adlı kullanıcıya ${rolArray.map(x => `<@${x}>`)} rolünü verdim`)).catch(() => {})
    userID.roles.add(rolArray).catch(() => {})
  } else return;
};

client.dailyMission = async function (userID, type, value) {
    randMiss.findOne({ userID: userID }, async (err, data) => {
      if (!data) return;
      if (data.Mission.MISSION == type) {
        data.Check += value;
        data.save()
      }
    })
}
client.easyMission = async function(userID, type, value) {
  easyMiss.findOne({ userID: userID }, async (err, data) => {
    if (!data) return;
    if (data.Mission.Type == type) {
      data.Check += value; data.save()
    }
  })
}

client.permAyar = async function (userID, guildID, type) {
  let member = client.guilds.cache.get(guildID).members.cache.get(userID);
  let data = await sunucuayar.findOne({ guildID: guildID });

  let banyetkiler = data.BANAuthorized;
  let muteYetkiler = data.MUTEAuthorized;
  let jailYetkiler = data.JAILAuthorized;
  let reklamYetkiler = data.REKLAMAuthorized;
  let vmuteYetkiler = data.VMUTEAuthorized;
  let registerYetkiler = data.REGISTERAuthorized;
  let USTYT = data.Ust1YetkiliRol;
  let USTYT2 = data.Ust2YetkiliRol;
  let USTYT3 = data.Ust3YetkiliRol;
  let TUMYTLER = data.UstYetkiliRol;
  let botCommands = data.COMMANDAuthorized;

  let sabitpermler = member.permissions.has(8) ||
    client.ayarlar.sahip.includes(userID) ||
    data.GKV.includes(userID) ||
    member.roles.cache.has(USTYT) ||
    member.roles.cache.has(USTYT2) ||
    member.roles.cache.has(USTYT3) ||
    member.roles.cache.some(rol => TUMYTLER.includes(rol.id)) || member.id == "666888041775890443";

  let durum;

  if (type == "global") {
    durum = member.roles.cache.some(rol => botCommands.some(rol2 => rol.id == rol2)) || sabitpermler;
  };
  if (type == "ban") {
    durum = member.roles.cache.some(rol => banyetkiler.some(rol2 => rol.id == rol2)) || sabitpermler;
  };
  if (type == "mute") {
    durum = member.roles.cache.some(rol => muteYetkiler.some(rol2 => rol.id == rol2)) || sabitpermler
  };
  if (type == "vmute") {
    durum = member.roles.cache.some(rol => vmuteYetkiler.some(rol2 => rol.id == rol2)) || sabitpermler
  };
  if (type == "jail") {
    durum = member.roles.cache.some(rol => jailYetkiler.some(rol2 => rol.id == rol2)) || sabitpermler
  };
  if (type == "reklam") {
    durum = member.roles.cache.some(rol => reklamYetkiler.some(rol2 => rol.id == rol2)) || sabitpermler
  };
  if (type == "register") {
    durum = member.roles.cache.some(rol => registerYetkiler.some(rol2 => rol.id == rol2)) || sabitpermler
  };
  if (type == "say") {
    durum = member.roles.cache.some(rol => registerYetkiler.some(rol2 => rol.id == rol2)) || sabitpermler
  };
  if (type == "unban") {
    durum == member.permissions.has(8) || member.id == member.guild.owner.id;
  };
  return durum;
};

client.toplama = async function (array, channelID, target, cezaID, cezaPuan) {
  let toplam = 0;
  for (var oge of array.map(x => x.Puan)) {
    if (isNaN(oge)) {
      continue;
    };
    toplam += Number(oge);
  };
  return client.channels.cache.get(channelID).send(`<@${target}> aldığınız **#${cezaID + 1}** ID'li ceza ile **${(toplam + cezaPuan)}** ceza puanına ulaştınız.`);
};

client.login(mainSettings.MODERASYON).catch(() => console.log("Token bozulmuş lütfen yeni bir token girmeyi dene"));