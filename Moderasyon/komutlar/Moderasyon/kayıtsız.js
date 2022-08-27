const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let otokayit = require("../../models/otokayit");
let limit = new Map();
let sure = new Map();
const ms = require("ms");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    let kntrl = limit.get(message.author.id)
    let sre = sure.get(message.author.id)
    if (kntrl >= 15 && sre > Date.now() && !message.member.permissions.has(8)) {
        return message.reply("Bu komut için limitiniz doldu.")
    }
    if (!sre) {
        sure.set(message.author.id, Date.now()+ms("1h"))
    }
    
    limit.set(message.author.id, (limit.get(message.author.id) || 0) +1)
    setTimeout(() => {
        limit.delete(message.author.id)
        sure.delete(message.author.id)
    }, ms("1h"));


	let data = await sunucuayar.findOne({})
    let tag = data.TAG;
    let tag2 = data.TAG2;
    let unRegisterRol = data.UNREGISTER;
    let boost = data.BOOST
    if (durum) { 
    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply("Lütfen bir kullanıcı etiketleyiniz!");
    if (target.id === message.author.id) return message.react(client.emojis.cache.find(x => x.name === "kck_iptal"))
    if (message.member.roles.highest.position <= target.roles.highest.position) return message.reply(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`);
    otokayit.deleteOne({userID: target.id}).exec();
        target.setNickname(`${target.user.username.includes(tag) ? tag : tag2 ? tag2 : tag} İsim | Yaş`)
     target.roles.set(target.roles.cache.has(boost) ? [boost, ...unRegisterRol] : [...unRegisterRol]).then(x => message.react(client.emojis.cache.find(x => x.name === "kck_tik"))).catch(y => message.react(client.emojis.cache.find(x => x.name === "kck_iptal")));
	} else return;
}
exports.conf = {aliases: ["unregister", "kayitsiz"]}
exports.help = {name: 'kayıtsız'}
