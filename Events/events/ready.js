const moment = require('moment');
require("moment-duration-format");
module.exports = async client => {
  try {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [Events]: Aktif, Komutlar yüklendi!`);
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [Events]: ${client.user.username} ismi ile giriş yapıldı!`);
    client.user.setStatus("dnd");
    let kanal = client.channels.cache.filter(x => x.type === "voice" && x.id === client.ayarlar.botSesID);
    setInterval(() => {
      const oynuyor = client.ayarlar.readyFooter;
      const index = Math.floor(Math.random() * (oynuyor.length));
      client.user.setActivity(`${oynuyor[index]}`, {
        type: "STREAMING"
      });
      kanal.map(channel => {
        if (channel.id === client.ayarlar.botSesID) {
          if (channel.members.some(member => member.id === client.user.id)) return;
          if (!client.channels.cache.get(client.ayarlar.botSesID)) return;
          client.channels.cache.get(channel.id).join().then(x => console.log("[Events] başarılı bir şekilde ses kanalına bağlandı")).catch(() => console.log("Bot ses kanalına bağlanırken bir sorun çıktı Lütfen Yetkileri kontrol ediniz!"));
        } else return;
      });
    }, 10000);
  } catch (err) {}


};

