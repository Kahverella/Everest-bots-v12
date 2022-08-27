const { MessageEmbed, Discord } = require("discord.js");
let moment = require("moment");
require("moment-duration-format")
let stats = require("../../models/stats");

module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;

const embed = new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
    .setThumbnail(message.guild.iconURL({ dynamic: true }))
    .setColor("BLACK")
    .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
    .addField("───────────────────",[
`• Sunucunun adı: **${message.guild.name}**`,
`• Sunucunun ID'si: \`${message.guild.id}\``,
`• Açılma Tarihi: \`${moment(message.guild.createdAt).format("LLL")}\``,
`• Boost Durumu: \`${message.guild.premiumSubscriptionCount}\` Takviye! (\`${message.guild.premiumTier}.\` Seviye!)`
    ])
    .addField("───────────────────",[
`• Rol sayısı: \`${message.guild.roles.cache.size}\``,
`• Kanal sayısı: \`${message.guild.channels.cache.size}\``,
`• Emoji sayısı: \`${message.guild.emojis.cache.size}\``
    ])
    .addField("───────────────────",[
`• Toplam üye sayısı: \`${message.guild.memberCount}\``,
`• Çevrimiçi üye sayısı: \`${message.guild.members.cache.filter(m => m.presence.status !== 'offline').size}\``,
`• Çevrimdışı üye sayısı: \`${message.guild.members.cache.filter(m => m.presence.status == 'offline').size}\``,
`• Sunucudaki Bot sayısı: \`${message.guild.members.cache.filter(x => x && x.user.bot).size}\``
    ])
message.channel.send(embed)
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["serversex"],
    permLevel: 4
  };
  
  exports.help = {
    name: 'serversex',
    description: "Aylık Üye Rolleri Dağıtır",
    usage: 'serversex',
    kategori: "Bot Yapımcısı"
  };