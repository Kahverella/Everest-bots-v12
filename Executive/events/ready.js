const moment = require('moment');
require("moment-duration-format");
let sunucuayar = require("../models/sunucuayar");
const client = global.client;
let conf = client.ayarlar
module.exports = async client => {
  let data = await sunucuayar.findOne({guildID: client.ayarlar.sunucuId});
  if (!data) console.log("Sunucu ayarları başarıyla yüklendi! artık kurulum yapabilirsiniz!"),
  await sunucuayar.updateOne({}, { guildID: client.ayarlar.sunucuId }, { upsert: true, setDefaultsOnInsert: true }).exec();

  try {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [Executive]: Aktif, Komutlar yüklendi!`);
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [Executive]: ${client.user.username} ismi ile giriş yapıldı!`);
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
          client.channels.cache.get(channel.id).join().then(x => console.log("[Executive] başarılı bir şekilde ses kanalına bağlandı")).catch(() => console.log("[Executive] ses kanalına bağlanırken bir sorun çıktı Lütfen Yetkileri kontrol ediniz!"));
        } else return;
      });
    }, 10000);
  } catch (err) {}
};