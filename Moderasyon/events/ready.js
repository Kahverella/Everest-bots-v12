const moment = require('moment');
let sunucuayar = require("../models/sunucuayar");
let muteInterval = require("../models/muteInterval");
let vmuteInterval = require("../models/vmuteInterval");
let jailInterval = require("../models/jailInterval");
require("moment-duration-format");
const client = global.client;
module.exports = async client => {
try {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [Moderasyon]: Aktif, Komutlar yüklendi!`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [Moderasyon]: ${client.user.username} ismi ile giriş yapıldı!`);

 client.user.setStatus("dnd");
 let kanal = client.channels.cache.filter(x => x.type === "voice" && x.id === client.ayarlar.botSesID);
  setInterval(() => {
      const oynuyor = client.ayarlar.readyFooter;
      const index = Math.floor(Math.random() * (oynuyor.length));
      client.user.setActivity(`${oynuyor[index]}`, { type: "STREAMING", url: "https://www.twitch.tv/kahvebutkahpe", status: "dnd" });
     
    kanal.map(channel => {
      if (channel.id === client.ayarlar.botSesID) {
        if (channel.members.some(member => member.id === client.user.id)) return;
        if (!client.channels.cache.get(client.ayarlar.botSesID)) return;
        client.channels.cache.get(channel.id).join().then(x => console.log("[Moderasyon] başarılı bir şekilde ses kanalına bağlandı")).catch(() => console.log("Bot ses kanalına bağlanırken bir sorun çıktı Lütfen Yetkileri kontrol ediniz!"));
      } else return;
    });
    }, 10000);

let sunucu = client.guilds.cache.get(client.ayarlar.sunucuId)
let sunucuData = await sunucuayar.findOne({ guildID: client.ayarlar.sunucuId })
let muteRol = sunucuData.MUTED;
let vmuteRol = sunucuData.VMUTED;
let unregister = sunucuData.UNREGISTER;
let booster = sunucuData.BOOST;

setInterval(async () => {
    let muted = await muteInterval.find({ "muted": true, "endDate": { $lte: Date.now() } });
    muted.forEach(async memberdata => {
        if (!sunucu) return;
        if (!sunucu.members.cache.has(memberdata.userID)) {
            await muteInterval.deleteOne({ userID: memberdata.userID }).exec()
        } else {
            let member = sunucu.members.cache.get(memberdata.userID)
            if (!member) return;
            await member.roles.remove(muteRol)
            await muteInterval.deleteOne({ userID: memberdata.userID }).exec()
        }
    });
}, 5000)
setInterval(async () => {
  let jail = await jailInterval.find({ jailed: true, endDate: { $lte: Date.now() } });
  jail.forEach(async memberdata => {
      if (!sunucu) return;
      if (!sunucu.members.cache.has(memberdata.userID)) {
          await jailInterval.deleteOne({ userID: memberdata.userID }).exec();
      } else {
          let member = sunucu.members.cache.get(memberdata.userID)
          if (!member) return;
          member.roles.cache.has(sunucuData.BOOST) ? unregister.push(booster) : unregister;
          await member.roles.set(unregister)
          await jailInterval.deleteOne({ userID: member.id }).exec();
      }
  });
}, 5000);
setInterval(async () => {
  let vmuted = await vmuteInterval.find({ muted: true, endDate: { $lte: Date.now() } })
  vmuted.forEach(async memberdata => {
      if (!sunucu) return;
      if (!sunucu.members.cache.has(memberdata.userID)) {
          vmuteInterval.deleteOne({ userID: memberdata.userID }).exec();
      } else {
          let member = sunucu.members.cache.get(memberdata.userID)
          if (!member) return;
              await member.roles.remove(vmuteRol)
              await member.voice.setMute(false).catch(() => {});
              vmuteInterval.deleteOne({ userID: memberdata.userID }).exec()
      }
  })
}, 5000);

} catch (err) { }
};