const { MessageEmbed,Discord } = require("discord.js");
const conf = client.ayarlar
const disbut = require('discord-buttons')
let mongoose = require("mongoose");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    if (message.member.permissions.has(8) || durum) {
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!args[0]) return message.reply("Rol bilgisine bakmak istediğin rolü belirt ve tekrar dene!")
        if (!role) return message.reply("Belirtmiş olduğun rolü bulamadım. Düzgün bir rol etiketle veya ID belirtip tekrar dene!")

        let offline = role.members.filter((member) => member.user.presence.status == 'offline').map(user => `<@${user.id}> [\`${user.displayName}\`]`)
        let offlinesize = role.members.filter((member) => member.user.presence.status == 'offline').size;
        let Onlinex = role.members.filter(User => User.voice.channel && User.presence.status !== "offline").map(x => `<@${x.id}> [\`${x.displayName}\`] (${x.voice.channel})`);
        let Onlinesize = role.members.filter(User => User.voice.channel && User.presence.status !== "offline").size;
        let OnlineVoice = role.members.filter(User => !User.voice.channel && User.presence.status !== "offline").map(x => `<@${x.id}> [\`${x.displayName}\`] (\`${x.id}\`)`);
        let OnlineVoiceSize = role.members.filter(User => !User.voice.channel && User.presence.status !== "offline").size;
        let sex = role.members.filter(User => !User.voice.channel && User.presence.status !== "offline").map(x => `<@!${x.id}>`);
        let roleMembers = role.members.map(user => `[\`${user.displayName}\`] <@${user.id}> - (\`${user.id}\`)`);

        let x1 = new disbut.MessageMenuOption().setValue("x1").setLabel(`Çevrimdışı Üyeler (${offlinesize})`)
        let x2 = new disbut.MessageMenuOption().setValue("x2").setLabel(`Aktif - Seste Olmayan (${OnlineVoiceSize})`)
        let x3 = new disbut.MessageMenuOption().setValue("x3").setLabel(`Aktif - Seste Olan (${Onlinesize})`)
        let x4 = new disbut.MessageMenuOption().setValue("x4").setLabel(`Roldeki Üyeler (${role.member.size})`)

        const menux = new disbut.MessageMenu()
        .setID('menu')
        .setPlaceholder('Lütfen bir seçim yapınız!')
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions(x1,x2,x3,x4)
            message.channel.send(`\`\`\`fix\nRolün Adı: ${role.name} (${role.id})\nRolün Rengi: ${role.hexColor}\nRoldeki üye sayısı: ${role.members.size}\`\`\``,menux)
            
            client.on("clickMenu", async (menu)  => {
                if (menu.values.includes("x1")) {
                    menu.reply.send(`${offline.join("\n")}`)
                }
                if (menu.values.includes("x2")) {
                    menu.reply.send(`${OnlineVoice.join("\n")}\n\`\`\`fix\n${sex.join(" ")}\`\`\``)
                }
                if (menu.values.includes("x3")) {
                    menu.reply.send(`${Onlinex.join("\n")}`)
                }
                if (menu.values.includes("x4")) {
                    menu.reply.send(`${roleMembers.join("\n")}`)
                }
            })
    } 
}
exports.conf = {
    aliases: ["no1"]
}
exports.help = {
    name: 'no1',
    description: "Belirtilen roldeki kişileri gösterir.",
  };