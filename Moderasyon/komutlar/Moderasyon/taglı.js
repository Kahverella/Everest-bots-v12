const { MessageEmbed, Discord } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let taglıData = require("../../models/taglıUye");
let taglıDatas = require("../../models/taglilarim");

let Stat = require("../../models/stats");
let StaffXP = require("../../models/stafxp");
const hanedan = require("../../models/hanedanlik");
let limit = new Map();
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let data = await sunucuayar.findOne({})
    if (durum) {

        if (args[0] == "top") {
            let datas = await taglıData.find({ Durum: "stat" });
            let kayitcilar = {};
            datas.forEach((value) => {
                if (kayitcilar[value.authorID]) kayitcilar[value.authorID] += 1;
                else kayitcilar[value.authorID] = 1
            })
            let sirali = Object.keys(kayitcilar).sort((a, b) => kayitcilar[b] - kayitcilar[a]).map(e => ({ User: e, Value: kayitcilar[e] }))
            sirali = sirali.map((user, index) => `**${index+1}.** <@${user.User}> \`${user.Value} Taglı.\``).splice(0, 30)
            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter(conf.footer)
                .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                .setDescription(`Top 25 Tag aldırma sıralaması aşağıda belirtilmiştir.\n\n${sirali.length > 0 ? sirali.join("\n") : "Veri yoktur"}`)
            return message.channel.send(embed)
        }
		 
		  if (args[0] == "sorgula") {
			  
			  let kisi = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
			  if (!kisi) return message.reply("Lütfen bir kişi etiketleyiniz.");
			  
			  
            let dataz = await taglıData.findOne({ userID: kisi.id, Durum: "stat" });
			if (!dataz) return message.reply("Etiketlediğin kullanıcı komut ile taga alınmamış.")

            return message.channel.send(`${kisi} (\`${kisi.id}\`) adlı kullanıcı; ${moment(data.Tarih).locale("tr").format("LLL")} tarihinde <@${data.authorID}> (\`${data.authorID}\`) adlı yetkili tarafından taga alınmış.`)
        }

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply("Lütfen bir kullanıcı etiketleyiniz!");
        if (target.id === message.author.id) return message.react(client.emojis.cache.find(x => x.name === "kck_iptal"));
		if (!target.user.username.includes(data.TAG)) return message.reply("Bu kullanıcı adına sunucu tagımızı almamış!")
        limit.set(target.id, true)
        await taglıData.findOne({ userID: target.id, Durum: "stat" }, async (err, res) => {
            if (!res)
                return message.reply(`Bu komutu sadece kayıtsız üyelere tag aldırdığınız zaman kullanabilirsiniz.`);
            if (res.authorID != "x")
                return message.reply(`Tag aldırmaya çalıştığın üye farklı bir yetkili tarafından zaten taga alınmış!`);
                    await message.channel.send(`${message.author}, Başarılı bir şekilde ${target} adlı üyeye tag aldırdınız.`);
                    message.react(client.emojis.cache.find(x => x.name === "kck_tik"));
                    client.channels.cache.find(x => x.name == "tag-aldır-log").send(`${message.author} adlı yetkili ${target} adlı yetkiliye başarılı bir şekilde tag aldırdı.`)
                    res.authorID = message.author.id, res.save();
                    
                    hanedan.findOne({userID: message.author.id, guildID:client.ayarlar.sunucuId}, (err, hanedanData) => {
                        if (!hanedanData) return;
                        hanedan.updateOne({userID: message.author.id, guildID: client.ayarlar.sunucuId}, {
                          $inc: {
                            [`Taglı`]: 1,
                          }
                        }, { upsert: true }).exec()
                    });
                    await taglıData.updateOne({ Tarih: Date.now(), userID: target.id, Durum: "puan" }, { authorID: message.author.id }, { upsert: true }).exec();
                    await taglıDatas.updateOne({ Tarih: Date.now(), userID: target.id}, { authorID: message.author.id }, { upsert: true }).exec();

                    Stat.updateOne({userID: message.author.id, guildID: message.guild.id}, {$inc: {["coin"]: 30}}, {upsert: true}).exec();
                    await client.easyMission(message.author.id, "taglı", 1);
                    await client.dailyMission(message.author.id, "taglı", 1)
                    baddAudit(message.author.id, 1)
        })
    }
  ;
}
exports.conf = {
    aliases: ["Taglı"]
}
exports.help = {
    name: 'taglı'
}

function baddAudit(id, value) {
    Stat.updateMany({ userID: id, guildID: client.ayarlar.sunucuId }, { $inc: { "yedi.TagMember": value } }).exec((err, res) => {
        if (err) console.error(err);
    });
};