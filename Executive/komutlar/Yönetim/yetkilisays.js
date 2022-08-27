const {
    MessageEmbed,
    Discord
  } = require("discord.js");
  let sunucuayar = require("../../models/sunucuayar");
  let table = require("string-table");
  module.exports.run = async (client, message, args, durum, kanal) => {
    
    if (!message.guild) return;
    let alt_yönetim = ["894954877539737675"];
    let orta_yönetim = ["894954877623619646","894954877623619647"]; 
    let üst_yönetim = ["902322784200425483","894954877640405034","894954877640405038"]; 


    let alt_yönetim_ses = message.guild.members.cache.filter(member => member.roles.cache.some(rol => alt_yönetim.includes(rol.id))).size
    let orta_yönetim_ses = message.guild.members.cache.filter(member => member.roles.cache.some(rol => orta_yönetim.includes(rol.id))).size
    let üst_yönetim_ses = message.guild.members.cache.filter(member => member.roles.cache.some(rol => üst_yönetim.includes(rol.id))).size


    let alt_yönetim_ses_olmayan = message.guild.members.cache.filter(member => member.roles.cache.some(rol => alt_yönetim.includes(rol.id)) && !member.voice.channel && member.presence.status !== "offline" && !member.user.bot).map(x => `<@${x.id}>`)
    let orta_yönetim_ses_olmayan = message.guild.members.cache.filter(member => member.roles.cache.some(rol => orta_yönetim.includes(rol.id)) && !member.voice.channel && member.presence.status !== "offline" && !member.user.bot).map(x => `<@${x.id}>`)
    let üst_yönetim_ses_olmayan = message.guild.members.cache.filter(member => member.roles.cache.some(rol => üst_yönetim.includes(rol.id)) && !member.voice.channel && member.presence.status !== "offline" && !member.user.bot).map(x => `<@${x.id}>`)

    let alt_yönetim_ses_olan = message.guild.members.cache.filter(member => member.roles.cache.some(rol => alt_yönetim.includes(rol.id)) && member.voice.channel && member.presence.status !== "offline" && !member.user.bot).map(x => `<@${x.id}>`)
    let orta_yönetim_ses_olan = message.guild.members.cache.filter(member => member.roles.cache.some(rol => orta_yönetim.includes(rol.id)) && member.voice.channel && member.presence.status !== "offline" && !member.user.bot).map(x => `<@${x.id}>`)
    let üst_yönetim_ses_olan = message.guild.members.cache.filter(member => member.roles.cache.some(rol => üst_yönetim.includes(rol.id)) && member.voice.channel && member.presence.status !== "offline" && !member.user.bot).map(x => `<@${x.id}>`)


    let alt_yönetim_aktif = message.guild.members.cache.filter(member => member.roles.cache.some(rol => alt_yönetim.includes(rol.id)) && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id) && (member.presence.status !== "offline")).size
    let orta_yönetim_aktif = message.guild.members.cache.filter(member => member.roles.cache.some(rol => orta_yönetim.includes(rol.id)) && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id) && (member.presence.status !== "offline")).size
    let üst_yönetim_aktif = message.guild.members.cache.filter(member => member.roles.cache.some(rol => üst_yönetim.includes(rol.id)) && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id) && (member.presence.status !== "offline")).size

  
  
    let alt_yönetim_aktifdeğil = message.guild.members.cache.filter(member => member.roles.cache.some(rol => alt_yönetim.includes(rol.id)) && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id) && member.presence.status == "offline").size
    let orta_yönetim_aktifdeğil = message.guild.members.cache.filter(member => member.roles.cache.some(rol => orta_yönetim.includes(rol.id)) && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id) && member.presence.status == "offline").size
    let üst_yönetim_aktifdeğil = message.guild.members.cache.filter(member => member.roles.cache.some(rol => üst_yönetim.includes(rol.id)) && !member.user.bot && !client.ayarlar.sahip.includes(member.user.id) && member.presence.status == "offline").size
  
    if(args[0]) {
    const Role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if (!Role) return message.reply("Lütfen bir rol etiketleyiniz veya Rol ID'si belirtiniz")
     const veri = Role.members.filter(User => !User.voice.channel && User.presence.status !== "offline").map(x => `<@${x.id}>`).join(",");
    message.channel.send(`${veri || "ÜYE YOK"}`, {split: { char: "," }})
    return;
    }

message.channel.send(`\`\`\`fix

Toplam: ${alt_yönetim_ses+orta_yönetim_ses+üst_yönetim_ses} kişi
Toplam: ${alt_yönetim_ses_olmayan.length+orta_yönetim_ses_olmayan.length+üst_yönetim_ses_olmayan.length} kişi seste değil

Alt yönetim: ${alt_yönetim_ses} kişi
Seste olanlar: ${alt_yönetim_ses_olan.length} kişi 
Seste olmayanlar: ${alt_yönetim_ses_olmayan.length} kişi 
Aktif Olanlar: ${alt_yönetim_aktif} kişi
Aktif Olmayanlar: ${alt_yönetim_aktifdeğil} kişi

Orta yönetim: ${orta_yönetim_ses} kişi
Seste olanlar: ${orta_yönetim_ses_olan.length} kişi 
Seste olmayanlar: ${orta_yönetim_ses_olmayan.length} kişi 
Aktif Olanlar: ${orta_yönetim_aktif} kişi
Aktif Olmayanlar: ${orta_yönetim_aktifdeğil} kişi

Üst yönetim: ${üst_yönetim_ses} kişi
Seste olanlar: ${üst_yönetim_ses_olan.length} kişi 
Seste olmayanlar: ${üst_yönetim_ses_olmayan.length} kişi 
Olanlar: ${üst_yönetim_aktif} kişi
Aktif Olmayanlar: ${üst_yönetim_aktifdeğil} kişi
\`\`\`
`).then(x=> message.channel.send(`${üst_yönetim_ses_olmayan.length+orta_yönetim_ses_olmayan.length+alt_yönetim_ses_olmayan.length > 0 ? üst_yönetim_ses_olmayan+orta_yönetim_ses_olmayan+alt_yönetim_ses_olmayan : "Tüm aktif yetkililer ses kanallarında görünüyor."}`, {
  code: "md",
  split: true
}))

}
  exports.conf = {
    aliases: ["ysay", "seslikontrol", "Yetkilisay", "yetkili-say"]
  }
  exports.help = {
    name: 'yetkilisay',
    description: "Yetkili istatistik verir.",
    usage: '',
    kategori: "Yönetim Komutları"
  };