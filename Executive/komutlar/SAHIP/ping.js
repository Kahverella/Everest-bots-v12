const Discord = require('discord.js');
exports.run = async function(client, message, params) {
  if (!message.guild) return
  if(!client.ayarlar.sahip.some(x => x == message.author.id)) return

  message.channel.send(`\`\`\`php\n${client.ws.ping}\`\`\``)
};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'ping',
  description: "Botu yeniden başlatmaya yarar",
  usage: 'ping',
  kategori: "Bot Yapımcısı"
};
