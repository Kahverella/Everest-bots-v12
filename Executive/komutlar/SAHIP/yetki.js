const disbut = require("discord-buttons");
const { MessageEmbed } = require("discord.js");
let puansystem = require("../../models/puansystem");
let sunucuayar = require("../../models/sunucuayar");
let coldowns = require("../../models/coldown");

let conf = client.ayarlar
module.exports.run = async (client, message, args, durum, kanal) => {
    if (message.member.permissions.has(8) || !client.ayarlar.sahip.some(x => x == message.author.id)) {
        let coldownsize = await coldowns.findOne({ userID: message.author.id }, { upsert: true });

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply("Lütfen bir kullanıcı etiketleyiniz!");
        if (message.member.roles.highest.position <= target.roles.highest.position) return message.reply(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`).then(msg => msg.delete({timeout: 5000}))
        if (target.id === message.author.id) return message.reply("Kendine işlem uygulayamazsın!").then(msg => msg.delete({timeout: 5000}))


        if(target.roles.cache.get('894954877623619646')) return message.reply(`Yönetime işlem uygulayamazsın.`).then(msg => msg.delete({timeout: 5000}))
        if(target.roles.cache.get('894954877623619647')) return message.reply(`Yönetime işlem uygulayamazsın.`).then(msg => msg.delete({timeout: 5000}))
        if(target.roles.cache.get('902322784200425483')) return message.reply(`Yönetime işlem uygulayamazsın.`).then(msg => msg.delete({timeout: 5000}))
        if(target.roles.cache.get('894954877640405034')) return message.reply(`Yönetime işlem uygulayamazsın.`).then(msg => msg.delete({timeout: 5000}))
        if(target.roles.cache.get('894954877640405038')) return message.reply(`Yönetime işlem uygulayamazsın.`).then(msg => msg.delete({timeout: 5000}))


let yükselt = new disbut.MessageButton().setStyle('green').setLabel('Yükselt!').setID('yükselt')
let düşür = new disbut.MessageButton().setStyle('red').setLabel('Düşür!').setID('düşür')


let msj = await message.channel.send(`${target} yetkilisine yapılacak işlemi seçiniz!`, { buttons: [yükselt,düşür] })
let filter = (btn) => btn.clicker.id === message.author.id;
let collector = msj.createButtonCollector(filter, {time: 20000});



collector.on('collect', async (button) => {
    
    if(button.id == "yükselt") { 
        let kanallar = await puansystem.findOne({
            guildID: message.guild.id
        });
        let yetkiler = kanallar.PuanRolSystem;

     for (var i = 0; i < yetkiler.length; i++) {
        if (yetkiler[i].ROLE_1 === kanallar.AutoRankUP.sabitROL) break;
    };
     yetkiler.slice(0, i).filter(user => target.roles.cache.get(user.ROLE_1)).map(async user => {
            target.roles.remove(user.ROLE_1)
            target.roles.add(user.ROLE_2)
            coldowns.updateOne({
                userID: message.author.id,
                guildID: message.guild.id
            }, {
                $inc: {
                    coldown: +1
                }
            }, {
                upsert: true
            }).exec();
     button.reply.send(`${target} kullanıcısının yetkisi yükseltildi!`)

})


    }


  if(button.id == "düşür") { 
    let kanallar = await puansystem.findOne({
        guildID: message.guild.id
    });
    let yetkiler = kanallar.PuanRolSystem;

 for (var i = 0; i < yetkiler.length; i++) {
    if (yetkiler[i].ROLE_1 === kanallar.AutoRankUP.sabitROL) break;
};
 yetkiler.slice(0, i).filter(user => target.roles.cache.get(user.ROLE_2)).map(async user => {
    target.roles.remove(user.ROLE_2)
    target.roles.add(user.ROLE_1)
    coldowns.updateOne({
        userID: message.author.id,
        guildID: message.guild.id
    }, {
        $inc: {
            coldown: +1
        }
    }, {
        upsert: true
    }).exec();
    button.reply.send(`${target} kullanıcısının yetkisi düşürüldü!`)

 
}) }})


}
}
exports.conf = {
    aliases: []
}
exports.help = {
    name: 'yetki'
}