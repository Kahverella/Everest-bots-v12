const { MessageActionRow, MessageButton } = require('discord-buttons')
let sunucuayar = require("../../models/sunucuayar");
const client = global.client;

module.exports.run = async (client, message, args, durum, kanal) => {
if (!client.ayarlar.sahip.some(x => x == message.author.id)) return;

let nitro = client.emojis.cache.find(emoji => emoji.name == "nitro");
let spotify = client.emojis.cache.find(emoji => emoji.name == "spotify");
let netflix = client.emojis.cache.find(emoji => emoji.name == "netflix");
let exxen = client.emojis.cache.find(emoji => emoji.name == "exxen");
let blutv = client.emojis.cache.find(emoji => emoji.name == "blutv");

let EventRole = client.guild.roles.cache.find((role) => role.name.toLowerCase().includes("etkinlik katılımcısı")).id;
let DrawRole = client.guild.roles.cache.find((role) => role.name.toLowerCase().includes("çekiliş katılımcısı")).id;

const row = new MessageActionRow({
    components: [
      new MessageButton({
        label: '🎉 Etkinlik Katılımcısı!',
        custom_id: 'event',
        disabled: false,
        style: 'green'
      }),
      new MessageButton({
        label: '🎁 Çekiliş Katılımcısı!',
        custom_id: 'draw',
        disabled: false,
        style: 'red'
      })
    ]
  })

message.channel.send(`**${client.ayarlar.tag}** Merhaba arkadaşlar, 

**${client.ayarlar.tag} ${client.ayarlar.sunucuAdı}** sunucusu olarak yapılan etkinlik ve çekilişlerden anında bildirim almanız için yapılan sistemi size sunuyoruz.

Çekiliş katılımcısı alarak ${nitro}, ${spotify}, ${netflix}, ${exxen}, ${blutv} gibi çekilişlere katılıp ödüllerin sahibi olabilirsiniz.

Aşağıda ki seçim menüsünden etkinlik katılımcısı alarak da yapılan konserlerden, etkinliklerden anında haberdar olabilirsiniz.`, { components: [row] })

client.on('clickButton', async (button) => {
    if (button.id === 'event') {
        if (button.clicker.member.roles.cache.get(EventRole)) {
            await button.clicker.member.roles.remove(EventRole);
            await button.reply.think(true);
            await button.reply.edit("Etkinlik Katılımcısı rolü üzerinden alındı.")
        } else {
            await button.clicker.member.roles.add(EventRole);
            await button.reply.think(true);
            await button.reply.edit("Etkinlik Katılımcısı rolü üzerine eklendi.")
        }
    }
    if (button.id === 'draw') {
        if (button.clicker.member.roles.cache.get(DrawRole)) {
            await button.clicker.member.roles.remove(DrawRole);
            await button.reply.think(true);
            await button.reply.edit("Çekiliş Katılımcısı rolü üzerinden alındı.")
        } else {
            await button.clicker.member.roles.add(DrawRole);
            await button.reply.think(true);
            await button.reply.edit("Çekiliş Katılımcısı rolü üzerine eklendi.")
        }
    }
  });

}
exports.conf = {
    aliases: ["eçkur"]
}
exports.help = {
    name: 'buton',
    description: "Sunucudaki etkinlik rolleri için sistem kurar.",
    usage: 'buton',
    kategori: "Bot Yapımcısı"
};