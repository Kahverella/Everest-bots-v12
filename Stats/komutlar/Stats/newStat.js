const { MessageEmbed } = require("discord.js");
const Stat = require("../../models/stats");
let profil = require("../../models/profil");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    if (kanal) return;

    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let profilData = await profil.findOne({ userID: target.id, guildID: message.guild.id }) || {
        userID: target.id,
        guildID: message.guild.id,
        BanAmount: 0,
        JailAmount: 0,
        MuteAmount: 0,
        VoiceMuteAmount: 0
    };
    let statemoji = client.emojis.cache.find(x => x.name === "kck_stat");
    let BanMiktar = profilData.BanAmount
    let JailMiktar = profilData.JailAmount
    let MuteMiktar = profilData.MuteAmount;
    let SesMuteMiktar = profilData.VoiceMuteAmount
    Stat.findOne({ userID: target.id, guildID: message.guild.id }, (err, data) => {
        if (!data) data = {
            yedi: { Voice: {}, Chat: {} },
            voiceCategory: {},
            voiceChannel: {},
            messageChannel: {},
            voiceLevel: 1,
            messageLevel: 1,
            voiceXP: 0,
            messageXP: 0,
            coin: 0.0
        }
        let voiceCategory = Object.keys(data.voiceCategory).splice(0, 10).sort(function (a, b) {
            return data.voiceCategory[b] - data.voiceCategory[a]
        }).map((x, index) => `${statemoji} ${message.guild.channels.cache.get(x) ? message.guild.channels.cache.get(x).name : "#silinmis-kanal"} \`${client.convertDuration(data.voiceCategory[x])}\``).join("\n");
        let voiceChannel = Object.keys(data.voiceChannel).splice(0, 10).sort(function (a, b) {
            return data.voiceChannel[b] - data.voiceChannel[a]
        }).map((x, index) => `${statemoji} ${message.guild.channels.cache.get(x) ? message.guild.channels.cache.get(x).name : "#silinmis-kanal"} \`${client.convertDuration(data.voiceChannel[x])}\``).join("\n");
        let messageChannel = Object.keys(data.messageChannel).splice(0, 5).sort(function (a, b) {
            return data.messageChannel[b] - data.messageChannel[a]
        }).map((x, index) => `${statemoji} ${message.guild.channels.cache.get(x) ? message.guild.channels.cache.get(x).name : "#silinmis-kanal"} \`${data.messageChannel[x]} mesaj\``).join("\n");
        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setThumbnail(target.user.avatarURL({dynamic: true}))
            .setDescription(`${target} (<@&${target.roles.highest.id}>) istatistikleri\n`)
        embed.addField(`**Toplam Kategori Bilgileri** (${client.convertDuration(data.totalVoice)})`, `${voiceCategory ? voiceCategory : "Veriler henüz yüklenmedi"}`)
        embed.addField(`**Toplam Kanal Sıralaması** (Toplam ${Object.keys(data.voiceChannel).length} kanalda durmuş)`, `${voiceChannel ? voiceChannel : "Veriler henüz yüklenmedi"}`)
        embed.addField(`**Toplam Mesaj Kanal Sıralaması** (${data.totalMessage} mesaj)`, `${messageChannel ? messageChannel : "Veriler henüz yüklenmedi"}`)
        embed.addField("Genel Bilgiler", `\`\`\`
(Ban: ${BanMiktar} - Mute: ${MuteMiktar} - Ses Mute: ${SesMuteMiktar} - Jail: ${JailMiktar})
\`\`\`
`)

        message.channel.send(embed)
    });
};
exports.conf = {
    aliases: ["stats", "Stat", "Stats"]
};
exports.help = {
    name: 'stat'
};