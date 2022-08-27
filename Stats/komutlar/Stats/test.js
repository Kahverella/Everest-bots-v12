const { MessageEmbed,MessageAttachment } = require("discord.js");
const { createCanvas } = require('canvas');
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;

  const code = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '')
  .toUpperCase()
  .slice(0,5);

  const canvas = createCanvas(900, 250);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#181818';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.font = 'lighter 175px Corbel';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(code, canvas.width / 2, 190);

  const attachment = new MessageAttachment(canvas.toBuffer(), 'oy.png');
  let embed = new MessageEmbed().setColor("BLACK").attachFiles(attachment).setImage('attachment://oy.png')

 await message.channel.send(embed);
}

exports.conf = {
  aliases: ["testx"]
} 
exports.help = {
  name: 'testx'
}
