const { MessageEmbed } = require("discord.js");
let easyMiss = require("../../models/haftalıkMission");
let ms = require("ms");
let moment = require("moment");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    let sec = args[0];
            let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(client.ayarlar.footer)
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
    if (message.member.permissions.has(8) || durum) {

            let target = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.author;
            let data = await easyMiss.findOne({ userID: target.id });
            if (!data) return message.reply("Bakmaya çalıştığınız üye görevlendirilmemiş");
            message.channel.send(embed.setDescription(`
Görev Durumu: \`${data.Check >= data.Mission.Amount ? "Bitti": "Devam Ediyor"}\`
Görev Türü: \`${data.Mission.Type}\`
Yapılan Miktar: \`${data.Mission.Type == "ses" ? (data.Check/(1000*60*60)).toFixed(0)+" saat" : data.Check}/${data.Mission.Type == "ses" ? (data.Mission.Amount/(1000*60*60)).toFixed(0)+" saat" : data.Mission.Amount}\`
Görev Süresi: \`${moment(data.Time).locale("tr").fromNow()} bitiyor\`
Görev Bitiş Tarihi: \`${moment(data.Time + ms("3h")).locale("tr").format("LLL")}\`

${client.emojis.cache.find(x => x.name == "yildiz")} **İlerleme**
- Yapılan: \`${data.Mission.Type == "ses" ? (data.Check / (1000 * 60 * 60)).toFixed(0) : data.Check}\` Yapılması Gereken: \`${data.Mission.Type == "ses" ? (data.Mission.Amount/(1000*60*60)).toFixed(0) : data.Mission.Amount}\`
${progressBar(data.Check, data.Mission.Amount, 8)} \`${data.Mission.Type == "ses" ? (data.Check / (1000 * 60 * 60)).toFixed(0) : data.Check} / ${data.Mission.Type == "ses" ? (data.Mission.Amount/(1000*60*60)).toFixed(0) : data.Mission.Amount}\`
`))
        
     
    }

    
}
exports.conf = {
    aliases: ["görevlerim"]
}
exports.help = {
    name: 'görevlerim',
    description: "Görev sistsemleri komutu.",
    usage: 'ver',
    kategori: "Yönetici Komutları"
  };

function progressBar(value, maxValue, size) {
    const percentage = value >= maxValue ? 100 / 100 : value / maxValue;
    const progress = Math.round((size * percentage));
    const emptyProgress = size - progress;
    const progressText = `${client.emojis.cache.find(x => x.name == "kck_ortabar")}`.repeat(progress);
    const emptyProgressText = `${client.emojis.cache.find(x => x.name == "kck_griortabar")}`.repeat(emptyProgress);
    const bar = `${value ? client.emojis.cache.find(x => x.name == "kck_solbar") : client.emojis.cache.find(x => x.name == "kck_baslangicbar")}` + progressText + emptyProgressText + `${emptyProgress == 0 ? `${client.emojis.cache.find(x => x.name === "kck_bitisbar")}` : `${client.emojis.cache.find(x => x.name === "kck_gribitisbar")}`}`;
    return bar;
};