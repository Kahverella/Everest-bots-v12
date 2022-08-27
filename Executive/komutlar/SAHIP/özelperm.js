const özelpermmodels = require("../../models/özelperm")
const { MessageEmbed } = require("discord.js")
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    if (durum) {
        let sec = args[0];
        if (!sec) return message.reply("Lütfen bir komut giriniz");
        if (sec == "bak") {
            let db = await özelpermmodels.find({ guildID: message.guild.id })
            message.channel.send(`Özel Perm Bilgileri:`, { code: "fix" }).then(x =>
                message.channel.send(db.map((x, index) => `(${index + 1}) [${x.komutAd}] ••❯ ${x.roller.length != 0 ? x.roller.map(x => `${message.guild.roles.cache.get(x).name}`) : "rol yoktur"}\n`).join("\n"), { split: true, code: "css" }))
            return
        }
        let rol = message.mentions.roles.map(r => r.id);
        let user = message.mentions.members.map(r => r.id);
        client.db.findOne({ komutAd: sec, guildID: message.guild.id }, (err, res) => {
            if (!res) {
                let newData = new client.db({
                    guildID: message.guild.id,
                    komutAd: sec,
                    roller: rol,
                    kisiler: user,
                })
                message.reply(`Başarılı bir şekilde ${user.length > 0 && rol.length > 0 ? `${user.map(x => `<@${x}>`)} üyelerini ve ${rol.map(x => `<@&${x}>`)} rollerini ekledin` : rol.length > 0 ? rol.map(x => `<@&${x}>`) + " rollerini ekledin" : user.length > 0 ? user.map(x => `<@${x}>`) + " kişilerini ekledin" : ``}`)
                newData.save()
            } else {
                if (rol) {
                    res.roller = rol
                }
                if (user) {
                    res.kisiler = user
                }
                res.save();
                message.reply(`Başarılı bir şekilde ${user.length > 0 && rol.length > 0 ? `${user.map(x => `<@${x}>`)} üyelerini ve ${rol.map(x => `<@&${x}>`)} rollerini ekledin` : rol.length > 0 ? rol.map(x => `<@&${x}>`) + " rollerini ekledin" : user.length > 0 ? user.map(x => `<@${x}>`) + " kişilerini ekledin" : ``}`)
            }
        });
    }


};

exports.conf = {
    aliases: ["ÖzelPerm"]
};
exports.help = {
    name: 'özelperm',
    description: "Komutların kullanımını açar.",
    usage: 'özelperm',
    kategori: "Bot Yapımcısı"
};