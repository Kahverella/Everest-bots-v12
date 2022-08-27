const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    if (message.member.permissions.has(8) || durum) {
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!args[0]) return message.reply("Rol bilgisine bakmak istediğin rolü belirt ve tekrar dene!")
        if (!role) return message.reply("Belirtmiş olduğun rolü bulamadım. Düzgün bir rol etiketle veya ID belirtip tekrar dene!")
        let sayı = role.members.size
        if (sayı > 400) return message.channel.send(`${role} rolünde toplam ${sayı} kişi olduğundan dolayı rol bilgisini yollayamıyorum.`)

        let offline = role.members.filter((member) => member.user.presence.status == 'offline').map(user => `<@${user.id}> [\`${user.displayName}\`]`)
        let offlinesize = role.members.filter((member) => member.user.presence.status == 'offline').size;
        let Onlinex = role.members.filter(User => User.voice.channel && User.presence.status !== "offline").map(x => `<@${x.id}> [\`${x.displayName}\`] (${x.voice.channel})`);
        let Onlinesize = role.members.filter(User => User.voice.channel && User.presence.status !== "offline").size;
        let OnlineVoice = role.members.filter(User => !User.voice.channel && User.presence.status !== "offline").map(x => `<@${x.id}> [\`${x.displayName}\`] (\`${x.id}\`)`);
        let OnlineVocieSize = role.members.filter(User => !User.voice.channel && User.presence.status !== "offline").size;
        const sex = role.members.filter(User => !User.voice.channel && User.presence.status !== "offline").map(x => `<@!${x.id}>`);
        
message.channel.send(`**Rol Adı:** \`${role.name}\`(\`${role.id}\`)
**Rol Rengi:** \`${role.hexColor}\`
─────────────────────
**Üyeler** (\`Offline\`) (\`${offlinesize}\`) 
─────────────────────
${offline.join("\n")}
─────────────────────
**Üyeler** (\`Seste\`) (\`${Onlinesize}\`)
─────────────────────
${Onlinex.join("\n")}
─────────────────────
**Üyeler** (\`Aktif - Seste Olmayan\`) (\`${OnlineVocieSize}\`)
─────────────────────
${OnlineVoice.join("\n")}
\`\`\`fix\n${sex.join(" ")}\`\`\``, { split: true })

    } else return;
}
exports.conf = {
    aliases: ["rolbilgi"]
}
exports.help = {
    name: 'rolbilgi',
    description: "Belirtilen roldeki kişileri gösterir.",
    usage: '@RolEtiket',
    kategori:'Yönetim Komutları'
  };