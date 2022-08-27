const moment = require('moment');
let { MessageEmbed } = require('discord.js');
require("moment-duration-format");
const client = global.client;
module.exports = async client => {
try {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [Stats]: Aktif, Komutlar yüklendi!`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [Stats]: ${client.user.username} ismi ile giriş yapıldı!`);

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
        client.channels.cache.get(channel.id).join().then(() => console.log("[Stats] başarılı bir şekilde ses kanalına bağlandı")).catch(() => console.log("Bot ses kanalına bağlanırken bir sorun çıktı Lütfen Yetkileri kontrol ediniz!"));
      } else return;
    });
    }, 10000);

} catch (err) { }


setInterval(async() => {
  let alarmModel = require("../models/alarm.js");
  let alarmlar = await alarmModel.find({ bitis: { $lte: Date.now() } });
  for (let alarm of alarmlar) {
    let uye = client.guilds.cache.get(client.ayarlar.sunucuId).members.cache.get(alarm.uye);
    if (!uye) continue;
    let embed = new MessageEmbed().setColor("RANDOM").setDescription(alarm.aciklama).setTimestamp();
    uye.send(`**${uye} sana hatırlatmamı istediğin şeyin vakti geldi!**`, { embed: embed }).catch(err => {return undefined});
    let kanal = client.channels.cache.get(alarm.kanal);
    if (kanal) kanal.send(`**${uye} sana hatırlatmamı istediğin şeyin vakti geldi!**`, { embed: embed });
    await alarm.remove();
  };
}, 10000);

};