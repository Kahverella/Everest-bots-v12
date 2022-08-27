const {
  MessageEmbed
} = require("discord.js");
let moment = require("moment");
let sunucuayar = require("../models/sunucuayar");
let tagData = require("../models/taglıUye");
let yetkiDATA = require("../models/yetkili");
let statData = require("../models/stats");
let otokayit = require("../models/otokayit");
let hanedan = require("../models/hanedanlik");

let client = global.client;
module.exports = async (oldUser, newUser) => {

  if (oldUser.username !== newUser.username) {
    let ayarlar = await sunucuayar.findOne({})
    let yasaklıtag = ayarlar.BAN_TAG;
    let yasaklıtagRol = ayarlar.BANTAG;
    let boostRol = ayarlar.BOOST;
    let guild = client.guilds.cache.get(ayarlar.guildID);
    let user = guild.members.cache.get(oldUser.id);
    let totaltag = guild.members.cache.filter(member => member.user.username.includes(ayarlar.TAG)).size;
    let otoreg = await otokayit.findOne({
      userID: user.id
    })
    const embed = new MessageEmbed().setAuthor(user.displayName, user.user.avatarURL({
      dynamic: true
    })).setFooter(client.ayarlar.footer).setColor("RANDOM").setTimestamp();
    let log = client.channels.cache.get(ayarlar.TAGLOG);
    if (!log) return;
    if (newUser.username.includes(ayarlar.TAG) && !user.roles.cache.has(ayarlar.TEAM)) {
      if (user.manageable && ayarlar.TAG2) await user.setNickname(user.displayName.replace(ayarlar.TAG2, ayarlar.TAG)).catch();
      if (ayarlar.TEAM) await user.roles.add(ayarlar.TEAM).catch();
      if (ayarlar.TAGLOG && log) log.send(`
${user} adlı üye ( ${ayarlar.TAG} ) tagını kullanıcı adına ekleyerek ailemize katıldı! | Sunucuda bulunan toplam taglı üyemiz: (${totaltag}) 
─────────────────
Önce: ${oldUser.tag} | Sonra: ${newUser.tag}`).catch();
      await tagData.findOne({userID: user.id, Durum: "stat"}, async (err, res) => {
        if (!res) {
          let newData = new tagData({userID: user.id,authorID: "x",Tarih: Date.now(),Durum: "stat"});
          newData.save();
        }
      })
      await tagData.findOne({userID: user.id, Durum: "puan"}, async (err, res) => {
        if (!res) {
          let newData = new tagData({userID: user.id,authorID: "x",Tarih: Date.now(),Durum: "puan"});
          newData.save();
        }
      })
    } else if (!newUser.username.includes(ayarlar.TAG) && user.roles.cache.has(ayarlar.TEAM)) {
      if (user.manageable && ayarlar.TAG2) await user.setNickname(user.displayName.replace(ayarlar.TAG, ayarlar.TAG2)).catch();
      if (ayarlar.TEAM) {
        let ekipRol = guild.roles.cache.get(ayarlar.TEAM);
        let botcommandsroles = guild.roles.cache.get("894954877539737675");

        if (user.roles.cache.get("894954877539737675")) {
          client.channels.cache.get("895778800892248136").send(`
@here ${newUser} adlı üye yetkiyi bıraktı.

Bırakmadan önceki yetkileri:\n${user.roles.cache.filter(rol => botcommandsroles.position <= rol.position && !rol.managed).map(x => `<@&${x.id}>`)}
      `).then(x=> user.roles.remove(user.roles.cache.filter(rol => botcommandsroles.position <= rol.position && !rol.managed).map(x => x.id)))
    }
    
    setTimeout(() => {
         tagSaldi(user.id)
         user.roles.remove(user.roles.cache.has(boostRol) ? [boostRol, ayarlar.TEAM] : [ayarlar.TEAM]).catch();
      }, 3000);
    }
    
      let logs = client.channels.cache.get("895778740087423008");

      if (ayarlar.TAGLOG && logs) logs.send(`
<@&895782263583821875> ${user} adlı üye ( ${ayarlar.TAG} ) tagını kullanıcı adından silerek aramızdan ayrıldı!`).catch();
    
if (ayarlar.TAGLOG && log) log.send(`
${user} adlı üye ( ${ayarlar.TAG} ) tagını kullanıcı adından silerek aramızdan ayrıldı! | Sunucuda bulunan toplam taglı üyemiz: (${totaltag}) 
─────────────────
Önce: ${oldUser.tag} | Sonra: ${newUser.tag}`).catch();


    } else if (yasaklıtag.some(tag => newUser.username.includes(tag)) && !user.roles.cache.has(yasaklıtagRol)) {
      if (user.manageable) await user.setNickname(`Yasaklı Tag`).catch();
      await user.roles.set(user.roles.cache.get(boostRol) ? [boostRol, yasaklıtagRol] : [yasaklıtagRol]).catch(() => {
        console.log("Yasaklı tag güncelleme kodunda rol verilirken bir hata meydana geldi")
      });
    } else if (!yasaklıtag.some(tag => newUser.username.includes(tag)) && user.roles.cache.has(yasaklıtagRol)) {
      if (otoreg) {
        if (user.manageable) await user.roles.set(user.roles.cache.get(boostRol) ? otoreg.roleID.push(boostRol) : otoreg.roleID)
        user.setNickname(`${user.user.username.includes(ayarlar.TAG) ? ayarlar.TAG : ayarlar.TAG2} ${otoreg.name} | ${otoreg.age}`);
      } else {
        if (user.manageable) await user.roles.set(ayarlar.UNREGISTER);
        user.setNickname(`${user.user.username.includes(ayarlar.TAG) ? ayarlar.TAG : ayarlar.TAG2} ${user.displayName}`).catch();
      }
    };
  };
};
async function tagSaldi(memberID) {
  await tagData.deleteMany({
    userID: memberID
  }) 
  await yetkiDATA.deleteMany({
    userID: memberID
  })
  await hanedan.deleteOne({userID: memberID})
};
