const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let zaman = new Map();
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
	

    let data = await sunucuayar.findOne({});

    let tag = data.TAG
    let tag2 = data.TAG2 || tag;
    let rol = data.BOOST;
    if (!message.member.roles.cache.has(rol)) return;
    if(message.member.roles.cache.get("894954877539737675")) return message.reply("Yetkililer isim değişemez!")
    var isim = args.slice(0).join(" ");
    if(!isim) return message.reply("Yeni adını girmelisin.");
    
    if (zaman.get(message.author.id) >= 3) return message.reply("Komutu tekrar kullanabilmek için **5** dakika beklemeniz gerek!");
	zaman.set(message.author.id, (zaman.get(message.author.id) || 2));
	setTimeout(() => {
		zaman.delete(message.author.id)
	}, 5000 * 60)
    
    message.member.setNickname(`${message.member.user.username.includes(tag) ? tag : tag2} ${isim}`).catch(() => {});
    message.react(`${client.emojis.cache.find(x => x.name === "kck_tik")}`);

}
exports.conf = {aliases: ["boostme", "bme", "booster","zengin"]}
exports.help = {name: 'boost'}
