const { MessageEmbed } = require("discord.js");
require("moment-timezone")
const moment = require("moment")
let Stat = require("../../models/stats");
let stats = require("../../models/stats");
let sunucuayar = require("../../models/sunucuayar");
let xpData = require("../../models/stafxp");
let puansystem = require("../../models/puansystem");
let taglıData = require("../../models/taglıUye");
const yetkiliDB = require("../../models/yetkili");
let profil = require("../../models/profil");
let ozelKomut = require("../../models/özelkomut");
let missionSystem = require("../../models/randomMission");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    let sunucuData = await sunucuayar.findOne({ guildID: message.guild.id });
    if (durum || message.member.permissions.has(8) || message.member.roles.cache.get(sunucuData.EnAltYetkiliRol)) {
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let loading = await message.channel.send(`Veriler yükleniyor...`)

        let göster = await ozelKomut.find({ guildID: message.guild.id, YetkiliROL: true });
        let arr = []
        let veri = göster.map(x => x.YetkiliData)
        veri.forEach(v => v.forEach(x => arr.push(x)));

        let statemoji = client.emojis.cache.find(x => x.name === "kck_stat");
        let kahvestatlan = client.emojis.cache.find(x => x.name === "kahvestatlan");
        let data = await Stat.findOne({ userID: target.id, guildID: message.guild.id }) || {
            yedi: {
                Chat: {},
                Voice: {},
                TagMember: 0,
                Invite: 0,
                Register: 0,
                Yetkili: 0
            },
            messageChannel: {}
        };
        let data2 = await taglıData.find({ authorID: target.id, Durum: "puan" }) || [];
        let yetkiliData = await yetkiliDB.find({ authorID: target.id, Durum: "puan" }) || [];
        let kanallar = await puansystem.findOne({ guildID: message.guild.id });
        let puan = await xpData.findOne({ userID: target.id }) || { currentXP: 0 };

        let yetkiler = kanallar.PuanRolSystem;
        let ekPuan = puan.currentXP;

        let profilData = await profil.findOne({ userID: target.id,guildID: message.guild.id }) || {
            userID: target.id,
            guildID: message.guild.id,
            BanAmount: 0,
            JailAmount: 0,
            MuteAmount: 0,
            VoiceMuteAmount: 0,
            ReklamAmount: 0
        };
        let BanMiktar = profilData.BanAmount
        let JailMiktar = profilData.JailAmount
        let MuteMiktar = profilData.MuteAmount
        let SesMuteMiktar = profilData.VoiceMuteAmount
        let ReklamMiktar = profilData.ReklamAmount

        let pubPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? kanallar.PublicKanallar.Puan * 1.2 : kanallar.PublicKanallar.Puan;
        let oyunPuan = target.roles.cache.some(rol => kanallar.GameKanallar.Rol.includes(rol.id)) ? 8 : kanallar.GameKanallar.Puan;
        let kayitPuan = target.roles.cache.some(rol => kanallar.KayitKanallar.Rol.includes(rol.id)) ? 12 : kanallar.KayitKanallar.Puan;
        let streamPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? kanallar.StreamKanallar.Puan * 1.2 : kanallar.StreamKanallar.Puan;
        let secretPuan = target.roles.cache.some(rol => kanallar.SecretKanallar.Rol.includes(rol.id)) ? 2 : kanallar.SecretKanallar.Puan;
        let mesajPuan = target.roles.cache.some(rol => [].includes(rol.id)) ? kanallar.MesajKanallar.Puan * 1.2 : kanallar.MesajKanallar.Puan;
        let sleepPuan = target.roles.cache.some(rol => kanallar.SleepingKanal.Rol.includes(rol.id)) ? 3 : kanallar.SleepingKanal.Puan;
        let alonePuan = target.roles.cache.some(rol => kanallar.AloneKanallar.Rol.includes(rol.id)) ? 2 : kanallar.AloneKanallar.Puan;
        let musicPuan = target.roles.cache.some(rol => kanallar.Müzik.Rol.includes(rol.id)) ? 2 : kanallar.Müzik.Puan;
        let taglıPuan = target.roles.cache.some(rol => kanallar.TagMember.Rol.includes(rol.id)) ? 30 : kanallar.TagMember.Puan;
        let invitePuan = target.roles.cache.some(rol => kanallar.Invite.Rol.includes(rol.id)) ? 12 : kanallar.Invite.Puan;
        let teyitPuan = target.roles.cache.some(rol => kanallar.Register.Rol.includes(rol.id)) ? 5 : kanallar.Register.Puan;
        let terapipuan = target.roles.cache.some(rol => kanallar.TerapiKanallar.Rol.includes(rol.id)) ? 10 : kanallar.TerapiKanallar.Puan;
        let sorunçözmepuan = target.roles.cache.some(rol => kanallar.SorunCozmeKanallar.Rol.includes(rol.id)) ? 10 : kanallar.SorunCozmeKanallar.Puan;
        let meetingPuan = target.roles.cache.some(rol => kanallar.Toplantı.Rol.includes(rol.id)) ? 10 : kanallar.Toplantı.Puan;
        let yetkiliPuan = target.roles.cache.some(rol => kanallar.Yetkili.Rol.includes(rol.id)) ? 25 : kanallar.Yetkili.Puan;


        let pubOda = yetkiliStat(data.yedi.Voice, kanallar.PublicKanallar.Id, kanallar.SleepingKanal.Id);
        let oyunodalar = yetkiliStat(data.yedi.Voice, kanallar.GameKanallar.Id, []);
        let kayıt = yetkiliStat(data.yedi.Voice, kanallar.KayitKanallar.Id, []);
        let stream = yetkiliStat(data.yedi.Voice, kanallar.StreamKanallar.Id, []);
        let secret = yetkiliStat(data.yedi.Voice, kanallar.SecretKanallar.Id, []);
        let mesaj = data.yedi.Chat ? yetkiliStat(data.yedi.Chat, kanallar.MesajKanallar.Id, []) : 0;
        let sleeping;
        if (!data.yedi.Voice) sleeping = 0;
        else sleeping = data.yedi.Voice[kanallar.SleepingKanal.Id] || 0;
        let alone = yetkiliStat(data.yedi.Voice, kanallar.AloneKanallar.Id, []);
        let music = yetkiliStat(data.yedi.Voice, kanallar.Müzik.Id, []);
        let terapi = yetkiliStat(data.yedi.Voice, kanallar.TerapiKanallar.Id, []);
        let sçözme = yetkiliStat(data.yedi.Voice, kanallar.SorunCozmeKanallar.Id, []);
        let meeting = yetkiliStat(data.yedi.Voice, kanallar.Toplantı.Id, []);
        let yetkili = yetkiliData.length;
        let taglı = data2.length;
        let invite = data.yedi.Invite;
        let teyit = data.yedi.Register;
		

let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
let statData = await stats.findOne({userID: user.id, guildID: message.guild.id}) || {autoRankup: []};
 let member = message.guild.members.cache.get(user.id);
    let nickname = member.displayName == user.username ? "" + user.username + " [Yok] " : member.displayName
    const members = message.guild.members.cache.filter(x => !x.user.bot).array().sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
    const joinPos = members.map((u) => u.id).indexOf(member.id);
    const roles = member.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
    const rolleri = [];
    if (roles.length > 6) {
        const lent = roles.length - 6;
        let itemler = roles.slice(0, 6);
        itemler.map(x => rolleri.push(x));
        rolleri.push(`${lent}...`);
    } else {
        roles.map(x => rolleri.push(x));
    };
        let totalpoints = parseInt((pubOda / (1000 * 60 * 60 * 1) * pubPuan)) +
            parseInt((oyunodalar / (1000 * 60 * 60 * 1) * oyunPuan)) +
            parseInt((kayıt / (1000 * 60 * 60 * 1) * kayitPuan)) +
            parseInt((stream / (1000 * 60 * 60 * 1) * streamPuan)) +
            parseInt((secret / (1000 * 60 * 60 * 1) * secretPuan)) +
            parseInt((mesaj * mesajPuan)) +
            parseInt((sleeping / (1000 * 60 * 60 * 1) * sleepPuan)) +
            parseInt((alone / (1000 * 60 * 60 * 1) * alonePuan)) +
            parseInt((music / (1000 * 60 * 60 * 1) * musicPuan)) +
            parseInt((terapi / (1000 * 60 * 60 * 1) * terapipuan)) +
            parseInt((sçözme / (1000 * 60 * 60 * 1) * sorunçözmepuan)) +
            parseInt((meeting / (1000 * 60 * 60 * 1) * meetingPuan)) +
            parseInt((yetkili * yetkiliPuan)) +
            parseInt((teyit * teyitPuan)) +
            parseInt((taglı * taglıPuan)) +
            parseInt((invite * invitePuan)) + Number(data.EtkinlikPuan)

        let mission = await missionSystem.findOne({ userID: target.id })
        let eglencepuan = parseInt((stream / (1000 * 60 * 60 * 1) * streamPuan)) + parseInt((oyunodalar / (1000 * 60 * 60 * 1) * oyunPuan)) + parseInt((music / (1000 * 60 * 60 * 1) * musicPuan));
        let ses = client.convertDuration(data.totalVoice);
        if (kanallar.AutoRankUP.Type == true) {
            for (var i = 0; i < yetkiler.length; i++) {
                if (yetkiler[i].ROLE_1 === kanallar.AutoRankUP.sabitROL) break;
            };
            yetkiler.slice(0, i).filter(user => target.roles.cache.get(user.ROLE_1)).map(async user => {
                if (totalpoints+parseInt(ekPuan) >= user.PUAN) {
                    target.roles.remove(user.ROLE_1)
                    target.roles.add(user.ROLE_2)
                    client.channels.cache.get(kanallar.AutoRankUP.LogChannel).send(`:tada: ${target} tebrikler!Gerekli XP 'ye ulaşarak **${message.guild.roles.cache.get(user.ROLE_1).name}** rolünden **${message.guild.roles.cache.get(user.ROLE_2).name}** rolüne atladın!`)
                await Stat.updateOne({ userID: target.id, guildID: message.guild.id }, {
                    $set: {
                        ["HanedanPuan"]: 0,
                        ["EtkinlikPuan"]: 0,
                        ["yedi.Id"]: target.id,
                        ["yedi.Voice"]: {},
                        ["yedi.Chat"]: {},
                        ["yedi.TagMember"]: 0,
                        ["yedi.Invite"]: 0,
                        ["yedi.Register"]: 0,
                        ["yedi.Yetkili"]: 0,
                    }
                }).exec(); 
                await xpData.updateOne({ userID: target.id }, { $set: { currentXP: 0 }}, { upsert: true }).exec(); 
                await ozelKomut.updateMany({ guildID: message.guild.id, komutAd: { $exists: true }}, { $pull: { YetkiliData: { Author: target.id }} }).exec(); 
                await taglıData.deleteMany({ Durum: "puan", authorID: target.id }); 
                await yetkiliDB.deleteMany({ Durum: "puan", authorID: target.id });
            }
    });
}
loading.delete();


let embedBas = `${target} Kullanıcısının Verileri Aşağıdaki Menüde Sıralanmıştır. Aşağıdaki Menüden İstediğiniz Verinin İstatistiğine Bakabilirsiniz.`

let TARGETembed = new MessageEmbed().setColor("#0x2f3136")
.setDescription(`**${embedBas}

\`•\` Kullanıcı Bilgisi
${kahvestatlan} Hesap: ${user}
${kahvestatlan} Kullanıcı ID: \`${member.id}\`
${kahvestatlan} Kuruluş Tarihi: \`${moment(member.user.createdTimestamp).locale("tr").format("LLL")} - (${moment(member.user.createdTimestamp).locale("tr").fromNow()})\`

\`•\` Sunucu Bilgisi
${kahvestatlan} Sunucu İsmi: \`${nickname}\`
${kahvestatlan} Katılım Tarihi: \`${moment(member.joinedAt).locale("tr").format("LLL")} - (${moment(member.joinedAt).locale("tr").fromNow()})\`
${kahvestatlan} Katılım Sırası: \`${joinPos} / ${message.guild.members.cache.size}\`

${kahvestatlan} Rolleri (\`${rolleri.length}\`): ${rolleri.join(", ")}**`)

let GENembed = new MessageEmbed().setColor("#0x2f3136")
.setDescription(`**${embedBas}**`)
.addField(`${kahvestatlan} Toplam Mesaj:`, `**\`\`\`fix\n${data.totalMessage ? data.totalMessage+" Mesajın Bulunmakta." : "Veri Bulunumadı"}\`\`\`**`, true)
.addField(`${kahvestatlan} Toplam Ses:`, `**\`\`\`fix\n${ses ? "Toplam "+ses+" Sesli Odalarda Bulunmuşsun." : "Veri Bulunumadı"}\`\`\`**`, true)
.addField(`${kahvestatlan} Toplam Kayıt:`, `**\`\`\`fix\n${teyit ? teyit+" Kayıt Yapmışsın." : "Veri Bulunumadı"}\`\`\`**`, true)
.addField(`${kahvestatlan} Toplam Davet:`, `**\`\`\`fix\n${invite ? invite+" Davet Yapmışsın." : "Veri Bulunumadı"}\`\`\`**`, true)
.addField(`${kahvestatlan} Toplam Taglı:`, `**\`\`\`fix\n${taglı ? taglı+" Taglı Üye Çekmişsin." : "Veri Bulunumadı"}\`\`\`**`, true)
.addField(`${kahvestatlan} Toplam Yetkili:`, `**\`\`\`fix\n${yetkili ? yetkili+" Yetkili Çekmişsin." : "Veri Bulunumadı"}\`\`\`**`, true)
.addField(`${kahvestatlan} Ses Kanalları:`, `**${statemoji} Sohbet Kanalları: \`${client.convertDuration(pubOda)} (${parseInt(pubOda/(1000 * 60 * 60 * 1) * pubPuan)} puan)\`
${statemoji} Kayıt Kanalları: \`${client.convertDuration(kayıt)} (${parseInt(kayıt/(1000 * 60 * 60 * 1) * kayitPuan)} puan)\`
${statemoji} Private Kanalları: \`${client.convertDuration(secret)} (${parseInt(secret/(1000 * 60 * 60 * 1) * secretPuan)} puan)\`
${statemoji} Toplantı Kanalları: \`${client.convertDuration(meeting)} (${parseInt(meeting/(1000 * 60 * 60 * 1) * meetingPuan)} puan)\`
${statemoji} Eğlence Kanalları: \`${client.convertDuration(stream)} (${eglencepuan} puan)\`
${statemoji} Sleep Odası: \`${client.convertDuration(sleeping)} (${parseInt(sleeping/(1000 * 60 * 60 * 1) * sleepPuan)} puan)\`**`)

let PUANembed = new MessageEmbed().setColor("#0x2f3136")
.setDescription(`**${embedBas}

${kahvestatlan} Puan Bilgileri:
${kahvestatlan} Toplam Puan: \`${(totalpoints+parseInt(ekPuan))} Puanın Bulunmakta.\`
${kahvestatlan} Ek Puan: \`${ekPuan} Takviye Puan Almışsın.\`**`)

let CEZAembed = new MessageEmbed().setColor("#0x2f3136")
.setDescription(`**${embedBas}

${kahvestatlan} Ceza Kullanımı:
\`\`\`diff
- ${BanMiktar} Kullanıcıyı Sunucudan Yasaklamışsın.
- ${JailMiktar} Kullanıcıyı Cezalandırmışsın.
- ${ReklamMiktar} Kullanıcıyı Reklam Yaptığı İçin Cezalandırmışsın.
+ ${MuteMiktar} Kullanıcıyı Yazı Kanallarında Susturmuşsun.
+ ${SesMuteMiktar} Kullanıcıyı Sesli Kanallarda Susturmuşsun.\`\`\`**`)

let GOREVembed = new MessageEmbed().setColor("#0x2f3136").setFooter("COFTEY <3 TRANSSLY <3 KAHVE")
.setDescription(`**${embedBas}

${kahvestatlan} Görev Bilgisi:
${mission ? ` > \`•\` Görev Durumu
- Tür: \`${mission.Mission.MISSION.toUpperCase()}\`
${mission.Mission.MISSION == "ses" ? `- Miktar: \`${(mission.Check/(1000*60)).toFixed(0)}\` Gereken Miktar: \`${(mission.Mission.AMOUNT/(1000*60)).toFixed(0)}\`` : `- Miktar: \`${(mission.Check).toFixed(0)}\` - Gerken Miktar: \`${(mission.Mission.AMOUNT).toFixed(0)}\``}
${progressBar(mission.Mission.MISSION == "ses" ? mission.Check/(1000*60) : mission.Check, mission.Mission.MISSION == "ses" ? mission.Mission.AMOUNT/(1000*60) : mission.Mission.AMOUNT, 6)} \`${mission.Mission.MISSION == "ses" ? `${(mission.Check/(1000*60)).toFixed(0)} / ${(mission.Mission.AMOUNT/(1000*60)).toFixed(0)}` : `${(mission.Check).toFixed(0)} / ${(mission.Mission.AMOUNT).toFixed(0)}`}\`
` : "Yapması gereken bir günlük görev olmadığı için görevleri listeleyemedim."}**`)

let YETKIembed = new MessageEmbed().setColor("#0x2f3136")
.setDescription(`**${embedBas}

${kahvestatlan} Yetki Durumu:
${yetkiler.filter(user => target.roles.cache.get(user.ROLE_1)).length > 0 ? yetkiler.filter(user => target.roles.cache.get(user.ROLE_1)).map(y => `${statemoji} Yetki atlama durumunuz \`${totalpoints+parseInt(ekPuan) >= y.PUAN ? "Atlamaya uygun" : totalpoints+parseInt(ekPuan) >=( y.PUAN /2) ? "Atlamaya yakın": "Atlamaya uygun değil."}\`\n
${client.emojis.cache.find(x => x.name == "kck_deynek")} Puan Durumu
- Puanınız: \`${totalpoints+parseInt(ekPuan)}\` Gereken Puan: \`${y.PUAN}\`
${progressBar(totalpoints+parseInt(ekPuan), y.PUAN, 6)}  \`${totalpoints+parseInt(ekPuan)} / ${y.PUAN}\`
${totalpoints+parseInt(ekPuan) >= y.PUAN ? `
${client.emojis.cache.find(x => x.name == "kck_deynek")} Yetki Atlayabilirsin!
Gerekli \`Puan\`'a ulaşarak <@&${y.ROLE_2}> yetkisine atlama hakkı kazandın!` : target.roles.cache.get(y.ROLE_1) ? `
${client.emojis.cache.find(x => x.name == "kck_deynek")} Yetki Durumu
Şuan <@&${y.ROLE_1}> rolündesiniz. <@&${y.ROLE_2}> rolüne ulaşmak için ${Number(y.PUAN-(totalpoints+parseInt(ekPuan)).toFixed(0))} \`Puan\` kazanmanız gerekiyor\n` : ""}`) : "Üzerinde bir rol olmadığı için yükselme tablosunu gösteremiyorum."}**`)

const disbut = require('discord-buttons');

const secenek = [
    { emoji: "📊", id: "ys_genel", label: "Genel İstatistik" },
    { emoji: "📊", id: "ys_puan", label: "Puan İstatistiği" },
    { emoji: "📊", id: "ys_ceza", label: "Ceza Bilgileri" },
    { emoji: "📊", id: "ys_gorev", label: "Görev Bilgileri" },
    { emoji: "📊", id: "ys_yetki", label: "Yetki Durumu" },
]

let kutucuk = []
    
secenek.forEach(x => {
    kutucuk.push(new disbut.MessageMenuOption().setLabel(x.label).setEmoji(x.emoji).setValue(x.id))
})

let ysmenu = new disbut.MessageMenu()
.setID('ysmenu')
.setPlaceholder('İstatistik Kategorisini Buradan Seçebilirsin.')
.setMaxValues(1)
.setMinValues(1)
kutucuk.forEach(xs => {
    ysmenu.addOption(xs)
})

const ysmenurow = new disbut.MessageActionRow()
.addComponent(ysmenu)

message.channel.send(TARGETembed, { components: [ysmenurow] }).then(async function(colec) {
colec.createMenuCollector(bıser => bıser.clicker.user.id === message.author.id).on('collect', async (menu) => {
if(menu.values[0] === "ys_genel") {
  menu.reply.defer();
  menu.message.edit(GENembed)
}
if(menu.values[0] === "ys_puan") {
  menu.reply.defer();
  menu.message.edit(PUANembed)
}
if(menu.values[0] === "ys_ceza") {
  menu.reply.defer();
  menu.message.edit(CEZAembed)
}
if(menu.values[0] === "ys_gorev") {
  menu.reply.defer();
  menu.message.edit(GOREVembed)
}
if(menu.values[0] === "ys_yetki") {
  menu.reply.defer();
  menu.message.edit(YETKIembed)
}
})
})

function yetkiliStat(data, parentArray, yasaklıArray) {
    let obje = 0;
    if (data) {
        parentArray.forEach(parentID => {
            let ekle = 0;
            message.guild.channels.cache.filter(channel => channel.parentID == parentID).forEach(channel => {
                if (!yasaklıArray.includes(channel.id)) ekle += (data ? (data[channel.id] || 0) : {});
            })
            obje = ekle
        })
        return obje
    } else return obje
}
};

}
exports.conf = {
    aliases: ["yetkilistat"]
}
exports.help = {
    name: 'ystat'
}
function progressBar(value, maxValue, size) {
    const percentage = value < 0 ? 0 : value >= maxValue ? 100 / 100 : value / maxValue;
    const progress = Math.round((size * percentage));
    const emptyProgress = size - progress;
    const progressText = `${client.emojis.cache.find(x => x.name == "kck_ortabar")}`.repeat(progress);
    const emptyProgressText = `${client.emojis.cache.find(x => x.name == "kck_griortabar")}`.repeat(emptyProgress);
    const bar = `${value ? client.emojis.cache.find(x => x.name == "kck_solbar") : client.emojis.cache.find(x => x.name == "kck_baslangicbar")}` + progressText + emptyProgressText + `${emptyProgress == 0 ? `${client.emojis.cache.find(x => x.name === "kck_bitisbar")}` : `${client.emojis.cache.find(x => x.name === "kck_gribitisbar")}`}`;
    return bar;
};


function yuzdelik(amount, value) {
    let miktar = amount;
    let istenen = value;
    return parseInt((miktar / istenen) * 100);
}
