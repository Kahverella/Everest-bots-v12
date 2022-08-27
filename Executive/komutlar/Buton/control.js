const disbut = require("discord-buttons");
const { MessageEmbed } = require("discord.js");
let sunucuayar = require("../../models/sunucuayar");
let eventayar = require("../../models/eventsetup");
let conf = client.ayarlar;
const moment = require("moment");

module.exports.run = async (client, message, args, durum, kanal) => {
    if (message.member.permissions.has(8) || !client.ayarlar.sahip.some(x => x == message.author.id)) {
      let eventvericik = await eventayar.findOne({});
      let config = {
        "etkinlik": eventvericik.ETKINLIK,
        "cekilis": eventvericik.CEKILIS,
    }

    let vericik = await sunucuayar.findOne({});
    let tag = vericik.TAG;
    let tagrol = vericik.TEAM
    let unregister = vericik.UNREGISTER
    let taglırold = message.guild.members.cache.filter(member => member.user.username.toLowerCase().includes(tag) && !member.roles.cache.has(tagrol) && !member.permissions.has(8))
    let etrol = message.guild.members.cache.filter(member => !member.roles.cache.has(eventvericik.CEKILIS) && !member.roles.cache.has(eventvericik.ETKINLIK) && !member.permissions.has(8));
    let kayıtsız = message.guild.members.cache.filter(x => x.roles.cache.size === 0)
    
let btagrol = new disbut.MessageButton().setStyle('green').setLabel('Tag Dağıt!').setID('btagrol').setDisabled(taglırold.size == 0);
let ecdagit = new disbut.MessageButton().setStyle('green').setLabel('Etkinlik/Çekiliş Dağıt').setID('ecdagit').setDisabled(etrol.size == 0);
let rolsüz = new disbut.MessageButton().setStyle('green').setLabel('Kayıtsız Dağıt').setID('rolsüz').setDisabled(kayıtsız.size == 0);
let permss = new disbut.MessageButton().setStyle('blurple').setLabel('Yönetim Listelesi').setID('permss')
let cancelss = new disbut.MessageButton().setStyle('red').setLabel('Kapat').setID('cancelss')

let perm8 = message.guild.roles.cache.filter(x => x.permissions.has(8))
let role8 = message.guild.roles.cache.filter(x => !x.permissions.has(8) && x.permissions.has(268435456))
let channel8 = message.guild.roles.cache.filter(x => !x.permissions.has(8) && x.permissions.has(16))


let embed = new MessageEmbed()
.setDescription(`${message.member.toString()}, \`${moment(Date.now()).locale("tr").format("LLL")}\` tarihinin Genel Control Şeması tablosu aşağıda belirtilmiştir.`)
.addField("__**Etkinlik/Çekiliş Rolü**__", `\`\`\`fix\n${etrol.size} Kişi\`\`\``, true)
.addField("__**Taglı Rol**__", `\`\`\`fix\n${taglırold.size} Kişi\`\`\``, true)
.addField("__**Kayıtsız Rol**__", `\`\`\`fix\n${kayıtsız.size} Kişi\`\`\``, true)
.addField("─────────────────────────────────────",[
    `${tag} Yöneticisi açık olan rol sayısı: \`${perm8.size}\``,
    `${tag} Sadece Rol Yöneti açık olan rol sayısı: \`${role8.size}\``,
    `${tag} Sadece Kanal Yöneti açık olan rol sayısı: \`${channel8.size}\``])
.setColor("RANDOM")
.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
.setTimestamp()
.setFooter(conf.footer)

let msj = await message.channel.send(embed, { buttons:[ btagrol,ecdagit,rolsüz,permss,cancelss ] })
let filter = (btn) => btn.clicker.id === message.author.id;
let collector = msj.createButtonCollector(filter, {time: 20000});

collector.on('collect', async (button) => {
    
    if (button.id == "ecdagit") { 
     button.reply.send(`Etkinlik ve Çekiliş rolü olmayan kullanıcı sayısı: **${etrol.size}**`)

    let rolid = [config.etkinlik,config.cekilis]
    etrol.forEach(x=> x.roles.add(rolid))
   
    }

    if (button.id == "btagrol") { 
     button.reply.send(`Tag rolü olmayan kullanıcı sayısı: **${taglırold.size}**`)
     taglırold.map(x=> x.roles.add(tagrol))
    }
  if (button.id == "rolsüz") { 
button.reply.send(`Rolsüz kullanıcı sayısı: **${kayıtsız.size}**`)
kayıtsız.map(x => x.roles.add(unregister))
  }
  
  if (button.id == "permss") { 
    button.reply.send(`
    \`\`\`fix\nYöneticisi Açık Roller ve Roldeki Üyeler;\`\`\`
    ${perm8.map(x =>`**• ${x.name} [\`${x.id}\`]**`).join("\n") || "Rol Yok"}
    \`\`\`fix\n${perm8.map(x =>`${x.members.map(user => `<@${user.id}>`)}`).join(" ") || "Rolde Üye Yok"}\`\`\`
    \`\`\`fix\nRol Yöneti Olan Roller ve Roldeki Üyeler;\`\`\`
    ${role8.map(x =>`**• ${x.name} [\`${x.id}\`]**`).join("\n") || "Rol Yok"}
    \`\`\`fix\n${role8.map(x =>`${x.members.map(user => `<@${user.id}>`)}`).join(" ") || "Rolde Üye Yok"}\`\`\`
    \`\`\`fix\nKanal Yöneti Olan Roller ve Roldeki Üyeler;\`\`\`
    ${channel8.map(x =>`**• ${x.name} [\`${x.id}\`]**`).join("\n") || "Rol Yok"}
    \`\`\`fix\n${channel8.map(x =>`${x.members.map(user => `<@${user.id}>`)}`).join(" ") || "Rolde Üye Yok"}\`\`\`
    `)
  }
  if (button.id == "cancelss") { msj.delete() }
})


}
}
exports.conf = {
    aliases: []
}
exports.help = {
    name: 'control',
    description: "Suncudaki üyelere rol dağıtımı sağlar.",
    usage: 'control',
    kategori: "Yönetici Komutları"
  };