let underworldInterval = require("../models/underworld")
let sunucuayar = require("../models/sunucuayar")
let ceza = require("../models/ceza");
let profil = require("../models/profil");
let moment = require("moment")
let {MessageEmbed} = require("discord.js")

module.exports = async (guild,user) => {

    let entry = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' }).then(audit => audit.entries.first());

    let data = await sunucuayar.findOne({})
    let underworldLogKanal = data.UNDERWORLDChannel;
    let cezaID = data.WARNID;

    let messageLogEmbed = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor("Sağ Tık Ban Atıldı!")
    .setFooter(conf.footer)
    .setTimestamp()
    .setDescription(`
• Ceza ID: \`#${cezaID+1}\`
• Cezalanan Üye: ${user.toString()} (\`${user.id}\`)
• Cezalayan Yetkili: ${entry.executor} (\`${entry.executor.id}\`)
• Ceza Tarihi: \`${moment(Date.now()).format('LLL')}\`
• Ceza Bitiş Tarihi: \`Kalıcı\`
`);
    await client.channels.cache.get(underworldLogKanal).send(messageLogEmbed);
    let newData = ceza({
        ID: cezaID + 1,
        userID: user.id,
        Yetkili: entry.executor.id,
        Ceza: "UNDERWORLD",
        Sebep: "SAĞ TIK BAN",
        Puan: 15,
        Atilma: Date.now(),
        Bitis: "KALICI",
    });
    await profil.updateOne({userID: guild.id, guildID: guild.id}, {$inc: {UnderworldAmount: 1}}, {upsert: true}).exec();
    await client.savePunishment();
    await newData.save();

    await underworldInterval.findOne({userID: user.id}, (err,data) => {
        if (!data) {
            newData = new underworldInterval({ userID: user.id, jailed: true })
            newData.save()
        } else {
            data.jailed = true,data.save();
        }
    })
  }
 