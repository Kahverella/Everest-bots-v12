const disbut = require("discord-buttons");
const { MessageEmbed } = require("discord.js");
let puansystem = require("../../models/puansystem");
let yetkiDATA = require("../../models/yetkili");
let moment = require("moment")
moment.locale("tr");

module.exports.run = async (client, message, args, durum, kanal) => {
    if (!client.ayarlar.sahip.some(x => x == message.author.id)) return;

    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!target) return message.reply("Lütfen bir kullanıcı etiketleyiniz.");

let up = new disbut.MessageButton().setStyle('green').setLabel('⬆ Yükseltme').setID('up')
let down = new disbut.MessageButton().setStyle('red').setLabel('⬇ Düşürme').setID('down')
let info = new disbut.MessageButton().setStyle('blurple').setLabel('❗ Bilgilendirme').setID('info')
let cancel = new disbut.MessageButton().setStyle('red').setLabel('Kapat').setID('cancel')

let updownpanel = new disbut.MessageActionRow().addComponents(up,down,info,cancel)
let yetkili = await yetkiDATA.findOne({ userID: target.id })

let kanallar = await puansystem.findOne({ guildID: message.guild.id });
let yetkiler = kanallar.PuanRolSystem;

let embed = new MessageEmbed()
.setDescription(`
**⟡** ${target.toString()} (\`${target.id}\`) adlı kullanıcının yetkili verileri

\` ••❯ \` Sorumlusu: ${target.toString()}
\` ••❯ \` Yetkiye Başlama Tarihi: \`${moment(Date.now()).format('LLL')}}\`
\` ••❯ \` Şuanki Yetkisi: ${yetkiler.filter(user => target.roles.cache.get(user.ROLE_1)).length > 0 ? yetkiler.filter(user => target.roles.cache.get(user.ROLE_1)).map(y => `<@&${y.ROLE_1}> `) : "**Yetkisi Yok**"}
\` ⬆ \` **Yükseltilme** İşleminde Alacağı Yetki: ${yetkiler.filter(user => target.roles.cache.get(user.ROLE_1)).length > 0 ? yetkiler.filter(user => target.roles.cache.get(user.ROLE_1)).map(y => `<@&${y.ROLE_2}> `) : "**Yetkisi Yok**"}
\` ⬇ \` **Düşürülme** İşleminde Alacağı Yetki: ${yetkiler.filter(user => target.roles.cache.get(user.ROLE_2)).length > 0 ? yetkiler.filter(user => target.roles.cache.get(user.ROLE_2)).map(y => `<@&${y.ROLE_1}> `) : "**Yetkisi Yok**"}
`)
.setColor("RANDOM")
.setAuthor(message.author.tag, message.author.avatarURL({ dynmic: true }))
.setFooter("Yükseltme ve düşürme işlemlerinde verilen görevler ve puan durumu sıfırlanır!")

 let msj = await message.channel.send(embed, { components: [ updownpanel ] })
 let filter = (btn) => btn.clicker.id === message.author.id;
 let collector = msj.createButtonCollector(filter, { time: 20000 });
 
 collector.on('collect', async (button) => {
     if(button.id == "up") { 
         let kanallar = await puansystem.findOne({ guildID: message.guild.id });
         let yetkiler = kanallar.PuanRolSystem;
 
      for (var i = 0; i < yetkiler.length; i++) {
         if (yetkiler[i].ROLE_1 === kanallar.AutoRankUP.sabitROL) break;
     };
      yetkiler.slice(0, i).filter(user => target.roles.cache.get(user.ROLE_1)).map(async user => {
             target.roles.remove(user.ROLE_1)
             target.roles.add(user.ROLE_2)
      button.reply.send(`${target} kullanıcısının yetkisi yükseltildi!`)
 })
}
 
   if(button.id == "down") { 
     let kanallar = await puansystem.findOne({ guildID: message.guild.id });
     let yetkiler = kanallar.PuanRolSystem;
 
  for (var i = 0; i < yetkiler.length; i++) {
     if (yetkiler[i].ROLE_1 === kanallar.AutoRankUP.sabitROL) break;
 };
  yetkiler.slice(0, i).filter(user => target.roles.cache.get(user.ROLE_2)).map(async user => {
     target.roles.remove(user.ROLE_2)
     target.roles.add(user.ROLE_1)
 button.reply.send(`${target} kullanıcısının yetkisi düşürüldü!`)
 }) 
}
})

}
exports.conf = {
    aliases: []
}
exports.help = {
    name: 'up',
    description: "Sunucudaki etkinlik rolleri için sistem kurar.",
    usage: 'up',
    kategori: "Bot Yapımcısı"
  };