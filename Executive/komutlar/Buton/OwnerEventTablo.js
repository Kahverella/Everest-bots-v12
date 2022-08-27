const disbut = require("discord-buttons");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
 if (!client.ayarlar.sahip.some(x => x == message.author.id)) return;

 let sunucuData = await sunucuayar.findOne({});
let ytsay = new disbut.MessageButton().setStyle('green').setLabel('Yetkili Say Sıfırla').setID('ytsay')
let yoklama = new disbut.MessageButton().setStyle('red').setLabel('Yoklama Al').setID('yoklama')
let eventst = new disbut.MessageButton().setStyle('green').setLabel('Etkinlik Başlat/Bitir').setID('eventst')
let toplantıcr = new disbut.MessageButton().setStyle('red').setLabel('Toplantı Çağır').setID('toplantıcr')
let Tablo = new disbut.MessageActionRow()
.addComponents(ytsay,yoklama,eventst,toplantıcr)

message.channel.send(`**⟡ Mirage** sunucusunun sunucu yönetim tablosu aşağıda yer almaktadır.`, { components:[ Tablo ] })



client.on('clickButton', async (button) => {
    if (button.id === 'ytsay') {

    }
    if (button.id === 'yoklama') {

    }
    if (button.id === 'eventst') {
      if (sunucuData.Etkinlik === false) {
        await button.reply.think(true)
        await sunucuayar.updateOne({ guildID: message.guild.id },{ $set: { Etkinlik: true }}, { upsert: true }).exec();
        await button.reply.edit("Başarılı bir şekilde etkinliği başlattınız!")
      } else {
        await button.reply.think(true)
        await sunucuayar.updateOne({ guildID: message.guild.id },{ $set: { Etkinlik: false }}, { upsert: true }).exec();
        await button.reply.edit("Başarılı bir şekilde etkinliği sonlandırdınız!")
    }
    }
    if (button.id === 'toplantıcr') {

    }
  });
}
exports.conf = {
    aliases: []
}
exports.help = {
    name: 'ownertablopanel',
    description: "Sunucudaki etkinlik rolleri için sistem kurar.",
    usage: 'ownertablopanel',
    kategori: "Bot Yapımcısı"
  };