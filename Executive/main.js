const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const { MessageButton } = require("discord-buttons");
const client = global.client = new Discord.Client({ fetchAllMembers: true });
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
moment.locale("tr");
const logs = require("discord-logs");
logs(client) 
require("discord-buttons")
const Stat = require("./models/stats");
let mainSettings = require(__dirname + "/../settings.js");
let mongoose = require("mongoose");

mongoose.connect(mainSettings.MongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

client.db = require("./models/özelperm");
const sunucuayar = require('./models/sunucuayar');
let randMiss = require("./models/randomMission");
let easyMiss = require("./models/easyMission");
require('./util/eventLoader')(client);

const hanedan = require("./models/hanedanlik");

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
  "STREAMER_KATEGORI": mainSettings.STREAMER_KATEGORI,
  "REGISTER_KATEGORI": mainSettings.REGISTER_KATEGORI,
  "SLEEP_ROOM": mainSettings.SLEEP_ROOM,
  "taglıAlım": mainSettings.taglıAlım,

  "footer": mainSettings.footer,
  "onsekizatilacakoda": mainSettings.onsekizatilacakoda,
  "onsekizodalar": mainSettings.onsekizodalar,
  "readyFooter": mainSettings.readyFooter,
  "chatMesajı": mainSettings.chatMesajı,
  "YETKI_VER_LOG": mainSettings.YETKI_VER_LOG,
  "CEZA_PUAN_KANAL": mainSettings.CEZA_PUAN_KANAL,

  "leaderboard": mainSettings.leaderboard,
  "yetkilisay": mainSettings.yetkilisay,
  "GörevSystem": mainSettings.GörevSystem,

  "vkyonetici": "",
}
const conf = client.ayarlar
global.conf = conf;

client.kullanabilir = function (id) {
  if (client.guilds.cache.get(mainSettings.sunucuId).members.cache.get(id).hasPermission("ADMINISTRATOR") || client.guilds.cache.get(mainSettings.sunucuId).members.cache.get(id).hasPermission("MANAGE_CHANNELS") || client.guilds.cache.get(mainSettings.sunucuId).members.cache.get(id).hasPermission("VIEW_AUDIT_LOG")) return true;
  return false;
};

const RLSchema = mongoose.Schema({
  Id: { type: String, default: null },
  Logs: { type: Array, default: []}
});
const RLModel = mongoose.model('rolelog', RLSchema);

client.on("guildMemberRoleRemove", async (member, role) => {
  const Log = await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(audit => audit.entries.first());
  if (!Log || !Log.executor || Log.executor.bot || Log.createdTimestamp < (Date.now() - 5000)) return;
  const Data = await RLModel.findOne({ Id: member.id }) || new RLModel({ Id: member.id });
  Data.Logs.push({
    Date: Date.now(),
    Type: "[KALDIRMA]",
    Executor: Log.executor.id,
    Role: role.id
  });
  Data.save();
});

client.on("guildMemberRoleAdd", async (member, role) => {
  const Log = await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(audit => audit.entries.first());
  if (!Log || !Log.executor || Log.executor.bot || Log.createdTimestamp < (Date.now() - 5000)) return;
  const Data = await RLModel.findOne({ Id: member.id }) || new RLModel({ Id: member.id });
  Data.Logs.push({
    Date: Date.now(),
    Type: "[EKLEME]",
    Executor: Log.executor.id,
    Role: role.id
  });
  Data.save()
});

client.on("message", async (message) => {
  let args = message.content.split(' ').slice(1);
  let prefix = "!"
  let command = message.content.split(' ')[0].slice(prefix.length);
  if (command === 'rollog' || command === 'rol-log') {
    if (!client.kullanabilir(message.author.id) && !mainSettings.commandChannel.includes(message.channel.name) && !message.member.roles.cache.get("743255932137373820")) return
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) return message.channel.send(`${message.author}, lütfen bir üye belirt.`);
    const data = await RLModel.findOne({ Id: user.id });
    let geri = new MessageButton().setID("geri").setLabel("◀ Önceki Sayfa").setStyle("green");
    let kapat = new MessageButton().setID("kapat").setLabel("Sayfaları Kapat").setStyle("red");
    let ileri = new MessageButton().setID("ileri").setLabel("Sonraki Sayfa ▶").setStyle("green");

    const liste = data ? data.Logs.map((res) => `**${res.Type}** [\`${moment(res.Date).locale("tr").format("LLL")}\`] <@${res.Executor}>: <@&${res.Role}>`).reverse() : ["Veri bulunamadı."];
    let page = 1;
    let embed = new MessageEmbed().setColor("RANDOM").setAuthor(user.tag, user.displayAvatarURL({ dynamic: true})).setTimestamp().setDescription(`${liste.slice(page == 1 ? 0 : page * 9 - 9, page * 9).join("\n")}`)
    const msg = await message.channel.send(embed);

    if (liste.length > 10) {
      const smsg = await msg.edit(embed, { buttons: [ geri, kapat, ileri ]});
      let filter = (button) => button.clicker.user.id === message.member.id;
      let collector = smsg.createButtonCollector(filter, { time: 30000 });

      collector.on('collect', async (button) => {
        if(button.id == "ileri") {
          if (liste.slice((page + 1) * 9 - 9, (page + 1) * 9).length <= 0) return;
          page += 1;
          let newList = liste.slice(page == 1 ? 0 : page * 9 - 9, page * 9).join("\n");
          smsg.edit(embed.setAuthor(user.tag, user.avatarURL({ dynamic: true })).setDescription(`${newList}`)).then(x => x.delete({ timeout: 25000 }))
        } 
        if(button.id == "kapat") {
          await msg.edit(`bb`).then(x => x.delete({ timeout: 100 }))
        }
         if(button.id == "geri") {
          if (liste.slice((page - 1) * 9 - 9, (page - 1) * 9).length <= 0) return;
          page -= 1;
          let newList = liste.slice(page == 1 ? 0 : page * 9 - 9, page * 9).join("\n");
          smsg.edit(embed.setAuthor(user.tag, user.avatarURL({ dynamic: true })).setDescription(`${newList}`)).then(x => x.delete({ timeout: 25000 }))
        }
      })
    }
  }

});
require('discord-buttons')(client)

let Database = require("./models/invite");
const guildInvites = new Map();
client.on("ready", async () => {
  client.guilds.cache.forEach(guild => {
    guild.fetchInvites().then(invites => guildInvites.set(guild.id, invites)).catch(err => console.log(err));
  });
});

client.on("inviteCreate", async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on("inviteDelete", invite => setTimeout(async () => {
  guildInvites.set(invite.guild.id, await invite.guild.fetchInvites());
}, 5000));
client.on("guildMemberAdd", async member => {
  let inviteChannelID = await sunucuayar.findOne({}).then(x => x.INVITEChannel);
  let cachedInvites = guildInvites.get(member.guild.id);
  let newInvites = await member.guild.fetchInvites();
  let usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses) || cachedInvites.find(inv => !newInvites.has(inv.code)) || {
    code: member.guild.vanityURLCode,
    uses: null,
    inviter: {
      id: null
    }
  };
  let inviter = client.users.cache.get(usedInvite.inviter.id) || {
    id: member.guild.id
  };
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7 * 24 * 60 * 60 * 1000;
  let inviteChannel = client.channels.cache.get(inviteChannelID);

  Database.findOne({
    guildID: member.guild.id,
    userID: member.id
  }, (err, joinedMember) => {
    if (!joinedMember) {
      let newJoinedMember = new Database({
        _id: new mongoose.Types.ObjectId(),
        guildID: member.guild.id,
        userID: member.id,
        inviterID: inviter.id,
        regular: 0,
        bonus: 0,
        fake: 0
      });
      newJoinedMember.save();
    } else {
      joinedMember.inviterID = inviter.id;
      joinedMember.save();
    };
  });
  if (isMemberFake) {
    Database.findOne({
      guildID: member.guild.id,
      userID: inviter.id
    }, (err, inviterData) => {
      if (!inviterData) {
        let newInviter = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: member.guild.id,
          userID: inviter.id,
          inviterID: null,
          regular: 0,
          bonus: 0,
          fake: 1
        });
        newInviter.save().then(x => {
          if (inviteChannel) inviteChannel.send(`${member} (\`${member.id}\`) Kullanıcısını **Davet Eden: ${inviter === member.guild.id ? member.guild.name : inviter}** **Ulaştığı Davet Sayısı:** \`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\` ⛔`).catch(err => {});
        });
      } else {
        inviterData.fake++
        inviterData.save().then(x => {
          if (inviteChannel) inviteChannel.send(`${member} (\`${member.id}\`) Kullanıcısını **Davet Eden: ${inviter === member.guild.id ? member.guild.name : inviter}** **Ulaştığı Davet Sayısı:** \`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\` ⛔`).catch(err => {});
        });
      };
    });
  } else {
    Database.findOne({
      guildID: member.guild.id,
      userID: inviter.id
    }, (err, inviterData) => {
      if (!inviterData) {
        let newInviter = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: member.guild.id,
          userID: inviter.id,
          inviterID: null,
          regular: 1,
          bonus: 0,
          fake: 0
        });
        newInviter.save().then(x => {
          if (inviteChannel) inviteChannel.send(`${member}  (\`${member.id}\`) Kullanıcısını **Davet Eden: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag}** **Ulaştığı Davet Sayısı:** \`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\` ☑️`).catch(err => {});
        });
      } else {
        hanedan.findOne({userID: inviter.id, guildID:client.ayarlar.sunucuId}, (err, hanedanData) => {
          if (!hanedanData) return;
          hanedan.updateOne({userID: inviter.id, guildID: client.ayarlar.sunucuId}, {
            $inc: {
              [`Davet`]: 1,
            }
          }, {upsert: true}).exec()
      });
        client.dailyMission(inviter.id, "davet", 1)
        client.easyMission(inviter.id, "davet", 1);
        aaddAudit(inviter.id, 1)
        Stat.updateOne({
          userID: inviter.id,
          guildID: member.guild.id
        }, {
          $inc: {
            ["coin"]: 2
          }
        }, {
          upsert: true
        }).exec();
        inviterData.regular++;
        inviterData.save().then(x => {
          if (inviteChannel) inviteChannel.send(`${member}  (\`${member.id}\`) Kullanıcısını **Davet Eden: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag}** **Ulaştığı Davet Sayısı:** \`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\` ☑️`).catch(err => {});
        });
      };
    });
  };
  guildInvites.set(member.guild.id, newInvites);
});
client.on("guildMemberRemove", async member => {
  let inviteChannelID = await sunucuayar.findOne({}).then(x => x.INVITEChannel);
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7 * 24 * 60 * 60 * 1000;
  let inviteChannel = client.channels.cache.get(inviteChannelID);
  Database.findOne({
    guildID: member.guild.id,
    userID: member.id
  }, async (err, memberData) => {
    if (memberData && memberData.inviterID) {
      let inviter = client.users.cache.get(memberData.inviterID) || {
        id: member.guild.id
      };
      Database.findOne({
        guildID: member.guild.id,
        userID: memberData.inviterID
      }, async (err, inviterData) => {
        if (!inviterData) {
          let newInviter = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 0,
            bonus: 0,
            fake: 0
          });
          newInviter.save();
        } else {
          if (isMemberFake) {
            if (inviterData.fake - 1 >= 0) inviterData.fake--;
          } else {
            if (inviterData.regular - 1 >= 0) inviterData.regular--;
          };
          inviterData.save().then(x => {
            if (inviteChannel) inviteChannel.send(`${member}  (\`${member.id}\`) Kullanıcısını **Davet Eden: ${inviter.id == member.guild.id ? member.guild.name : inviter.tag} ** **Kalan Davet Sayısı:** \`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\` ♿`).catch(err => {});
          });
        };
      });
    } else {
      if (inviteChannel) inviteChannel.send(`**${member.user.tag}** Sunucudan ayrıldı! Davetçi bulunamadı!`).catch(err => {});
    };
  });
});

client.login(mainSettings.EXECUTIVE).catch(err => console.log("Token bozulmuş lütfen yeni bir token girmeyi dene"));

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

client.sayilariCevir = function (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

client.convertDuration = (date) => {
  return moment.duration(date).format('H [saat,] m [dk.]');
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
};
Array.prototype.shuffle = function () {
  let i = this.length;
  while (i) {
    let j = Math.floor(Math.random() * i);
    let t = this[--i];
    this[i] = this[j];
    this[j] = t;
  }
  return this;
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
  client.channels.cache.get(kanal).send(embed).then(x => x.delete({ timeout: 5000 }))
  return embed
}

function aaddAudit(id, value) {
  Stat.updateMany({ userID: id, guildID: client.ayarlar.sunucuId }, { $inc: { "yedi.Invite": value } }).exec((err, res) => {
    if (err) console.error(err);
  });
};

client.addAudit = function (id, value, Type) {
  if (Type == "Erkek") {
    Stat.updateMany({ userID: id, guildID: client.ayarlar.sunucuId }, {
      $inc: {
        "yedi.Register": value,
        "Man": value,
        ["coin"]: 1
      }
    }, { upsert: true }).exec((err, res) => {
      if (err) console.error(err);
    });

  } else if (Type == "Kadin") {
    Stat.updateMany({ userID: id, guildID: client.ayarlar.sunucuId }, {
      $inc: {
        "yedi.Register": value,
        "Woman": value,
        ["coin"]: 1
      }
    }, { upsert: true }).exec((err, res) => {
      if (err) console.error(err);
    });
  } else return;
}

const coldown = require("./models/coldown") 

client.dailyMission = async function (userID, type, value) {
  randMiss.findOne({ userID: userID }, async (err, data) => {
    if (!data) return;
    if (data.Mission.MISSION == type) {
      data.Check += value;
      data.save()
    }
  })
}
client.easyMission = async function (userID, type, value) {
  easyMiss.findOne({ userID: userID }, async (err, data) => {
    if (!data) return;
    if (data.Mission.Type == type) {
      data.Check += value;
      data.save()
    }
  })
}
client.toplama = async function (array, channelID, target, cezaID, cezaPuan) {
  let toplam = 0;
  for (var oge of array.map(x => x.Puan)) {
    if (isNaN(oge)) {
      continue;
    };
    toplam += Number(oge);
  };
  return client.channels.cache.get(channelID).send(`<@${target}> aldığınız **#${cezaID+1}** ID'li ceza ile **${(toplam+cezaPuan)}** ceza puanına ulaştınız.`);
};