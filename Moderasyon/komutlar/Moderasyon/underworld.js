const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar;
let moment = require("moment")
moment.locale("tr");
let ms = require("ms");
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let ceza = require("../../models/ceza");
let profil = require("../../models/profil");
let underworldInterval = require("../../models/underworld");
var limit = new Map(); 

module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let sec = args[0];
    let data = await sunucuayar.findOne({})
    let underworldSorumlusu = data.UNDERWORLDAuthorized;
    let underworldLogKanal = data.UNDERWORLDChannel;
    let UNDERWORLDLimit = data.UNDERWORLDLimit;
    let cezaID = data.WARNID;
    let underworlROL = data.UNDERWORLD;
    let booster = data.BOOST
     
    if (sec == "setup") {
        if (!args[1]) return message.reply("Lütfen `yetki-kanal-limit` belirleyiniz")
        if (message.guild.members.cache.some(member => conf.sahip.some(sahip => member === sahip)) || message.member.permissions.has(8) || message.author.id === message.guild.owner.id) {
            await sunucuayar.findOne({
                guildID: message.guild.id
            }, async (err, data) => {
                if (args[1] == "yetki") {
                    let select;
                    if (message.mentions.roles.size >= 1) {
                        select = message.mentions.roles.map(r => r.id);
                    } else {
                        if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                        select = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
                    }
                    return data.UNDERWORLDAuthorized = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "kck_tik")))
                }
                if (args[1] == "kanal") {
                    let select = message.mentions.channels.first();
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                    return data.UNDERWORLDChannel = select.id, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "kck_tik")))
                }
                if (args[1] == "limit") {
                    let select = Number(args[2])
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                    return data.UNDERWORLDLimit = select, data.save().then(y => message.react(client.emojis.cache.find(res => res.name === "kck_tik")))
                }
            })
        } else return message.reply("Bu komutu kullanabilmek için YÖNETİCİ - Sunucu Sahibi olmanız gerekiyor")
    }

    if (await client.permAyar(message.author.id, message.guild.id, "underworld") || durum) {
        if (underworldSorumlusu.length >= 1 && client.channels.cache.get(underworldLogKanal) && UNDERWORLDLimit >= 1) {
            let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!target) return client.Embed(message.channel.id, `Lütfen bir kişi belirtiniz`);
            if (target.roles.cache.get(underworlROL)) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
            let reason = args.slice(1).join(" ");
            if (!reason) return message.reply("Lütfen bir sebep belirtiniz.")
            if (limit.get(message.author.id) >= UNDERWORLDLimit) return message.reply(`\`underworld komutu için limite ulaştın!\``);
            if (target.roles.cache.get(data.EnAltYetkiliRol) && !message.member.permissions.has(8)) return message.reply("Yetkililer birbirine ceza-i işlem uygulayamazlar.");
            if (message.member.roles.highest.position <= target.roles.highest.position) return client.Embed(message.channel.id, `Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)
            if (target.id === message.author.id) return;
            limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
            setTimeout(() => {
                limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1)
            },1000*60*3)
            await banSistemi(message, client, underworldLogKanal, target, cezaID, underworlROL, booster,reason);
            let cezalar = await ceza.find({userID: target.id});
            if (cezalar.length == 0) {
                cezalar = [{Puan: 0}, {Puan: 0}];
            };
            await client.toplama(cezalar,client.ayarlar.CEZA_PUAN_KANAL, target.id, cezaID, 15);
        } else return client.Embed(message.channel.id, "Lütfen underworld komudunun kurulumunu tamamlayınız `" + conf.prefix[0] + "underworld setup` yazarak kurunuz!")
    } else return;
}
exports.conf = {
    aliases: []
}
exports.help = {
    name: 'ban'
}
async function banSistemi(message, client, underworldLogKanal, target, cezaID, underworlROL, booster,reason) {

        let messageEmbed = `${target} Üyesi Sunucudan **${reason}** sebebiyle ${message.author} Tarafından underworld cezası yedi! **Ceza Numarası:** (\`#${cezaID+1}\`)`;
        let messageLogEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setFooter(conf.footer)
            .setTimestamp()
            .setDescription(`
• Ceza ID: \`#${cezaID+1}\`
• Cezalanan Üye: ${target.toString()} (\`${target.id}\`)
• Cezalayan Yetkili: ${message.author} (\`${message.author.id}\`)
• Ceza Tarihi: \`${moment(Date.now()).format('LLL')}\`
• Ceza Bitiş Tarihi: \`Kalıcı\`
• Ceza Sebebi: [\`${reason}\`]
`);
        await target.roles.set(target.roles.cache.get(booster) ? [underworlROL, booster] : [underworlROL]).then(async () => {
			if (target.voice.channel) {
				target.voice.setChannel(null);
			}
            await message.channel.send(messageEmbed);
            await client.channels.cache.get(underworldLogKanal).send(messageLogEmbed);
                let newData = ceza({
                    ID: cezaID + 1,
                    userID: target.id,
                    Yetkili: message.author.id,
                    Ceza: "UNDERWORLD",
                    Sebep: reason,
                    Puan: 15,
                    Atilma: Date.now(),
                    Bitis: "KALICI",
                });
                await profil.updateOne({userID: message.author.id, guildID: message.guild.id}, {$inc: {UnderworldAmount: 1}}, {upsert: true}).exec();
                await client.savePunishment();
                await newData.save();

                await underworldInterval.findOne({userID: target.id}, (err,data) => {
                    if (!data) {
                        newData = new underworldInterval({
                            userID: target.id,
                            jailed: true,
                        })
                        newData.save()
                    } else {
                        data.jailed = true,data.save();
                    }
                })
        });
};