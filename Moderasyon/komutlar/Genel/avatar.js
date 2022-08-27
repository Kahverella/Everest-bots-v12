const { MessageEmbed } = require('discord.js');
const { MessageButton , MessageActionRow } = require(`discord-buttons`)

module.exports.run = async (client, message, args) => {
	if (!message.guild) return;

  let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author;

  let embed = new MessageEmbed().setColor("RANDOM")
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
  
  let sex = new MessageButton().setStyle("url").setLabel(`Avatar URL`).setURL(`${user.avatarURL()}`)

  message.channel.send(embed, { buttons: [sex] });
}
exports.conf = {aliases: ["Avatar", "pp", "av"]}
exports.help = {name: 'avatar'}
