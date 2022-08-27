const {
    MessageEmbed,
    Discord
    } = require("discord.js");
    const conf = client.ayarlar;
    let mongoose = require("mongoose");
    let sunucuayar = require("../../models/sunucuayar");
    module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    if (message.member.permissions.has(8) || durum) {
    let data = await sunucuayar.findOne({});
    let sunucuTAG = data.TAG;
    let tag = await message.guild.members.cache.filter(member => member.user.username.includes(sunucuTAG) && !member.user.bot).size;
    let sesli = message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.filter(member => !member.user.bot).size).reduce((a, b) => a + b);
    let bot = message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.filter(member => member.user.bot).size).reduce((a, b) => a + b);
    let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setDescription(`
\`${sunucuTAG}\` Şu anda toplam **${sesli+bot}** kişi seslide.
\`${sunucuTAG}\` Sunucuda **${message.guild.memberCount}** adet üye var (**${message.guild.members.cache.filter(member => member.presence.status !== "offline").size}** Aktif)
\`${sunucuTAG}\` Toplamda **${tag}** kişi tagımızı alarak bizi desteklemiş.
\`${sunucuTAG}\` Toplamda **${message.guild.premiumSubscriptionCount}** adet boost basılmış! ve Sunucu **${message.guild.premiumTier}** seviye`);
    message.channel.send(embed)
    }
    }
    exports.conf = {
    aliases: ["sunucusay", "serversay", "Say"]
    };
    exports.help = {
    name: 'say'
    };
    