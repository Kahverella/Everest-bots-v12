const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    if (client.ayarlar.sahip.some(x => x == message.author.id)) {

        let sec = args[0]
        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setFooter(conf.footer)
            .setTimestamp() // ALOSHA ADAMDIR 
            .setDescription(`
\`\`\`SERVER SETUP\`\`\`
\`${conf.prefix[0]}setup tag <serverTAG>\`
\`${conf.prefix[0]}setup tag2 <serverTAG2>\`
\`${conf.prefix[0]}setup link <serverLINK>\`
\`${conf.prefix[0]}setup gkv @safedMember\`
\`\`\`CHANNEL SETUP\`\`\`
\`${conf.prefix[0]}setup chat #chatChannel\`
\`${conf.prefix[0]}setup register #registerChannel\`
\`${conf.prefix[0]}setup taglog #taglogChannel\`
\`${conf.prefix[0]}setup rules #rulesChannel\`
\`${conf.prefix[0]}setup sleep #sleepChannel\`
\`${conf.prefix[0]}setup category ID\`
\`${conf.prefix[0]}setup rol-ver-log #roleLogChannel\`
\`\`\`ROLES SETUP\`\`\`
\`${conf.prefix[0]}setup vkauthor @vkAuthorRole\`
\`${conf.prefix[0]}setup unregister @unregisterRole @unregisterRole2\`
\`${conf.prefix[0]}setup man @manRole @manRole2\`
\`${conf.prefix[0]}setup woman @womanRole @womanRole2\`
\`${conf.prefix[0]}setup team @teamRole\`
\`${conf.prefix[0]}setup boost @boostRole\`
\`${conf.prefix[0]}setup jail @jailRole\`
\`${conf.prefix[0]}setup underworld @jailRole\`
\`${conf.prefix[0]}setup reklam @reklamRole\`
\`${conf.prefix[0]}setup supheli @supheliRole\`
\`${conf.prefix[0]}setup bantag @banTagRole\`
\`${conf.prefix[0]}setup mute @mutedRole\`
\`${conf.prefix[0]}setup vmute @vmutedRole\`
\`${conf.prefix[0]}setup vkcezalı @vkcezalıRole\`
\`${conf.prefix[0]}setup dccezalı @dccezalıRole\`
\`${conf.prefix[0]}setup stcezalı @stcezalıRole\`
\`${conf.prefix[0]}setup registerauthorized @registerAuthorized @registerAuthorized2\`
\`${conf.prefix[0]}setup globalrol @globalrol1 @globalrol2\`
\`${conf.prefix[0]}setup enaltrol @enaltyetkilirolü\`

**Other Commands:**
\`${conf.prefix[0]}invite kanal\`,  \`${conf.prefix[0]}mute mutesetup\`, \`${conf.prefix[0]}mute vmutesetup\`
\`${conf.prefix[0]}jail setup\`, \`${conf.prefix[0]}ban setup\`
`)

        await sunucuayar.findOne({guildID: conf.sunucuId}, async (err, data) => {
            if (err) console.log(err)


            if (["TAG", "tag", "Tag"].some(y => y === sec)) {
                let select = args[1];
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.TAG = select, data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["TAG2", "tag2", "Tag2"].some(y => y === sec)) {
                let select = args[1];
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.TAG2 = select, data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["Link", "link", "lınk", "LINK", "LİNK"].some(y => y === sec)) {
                let select = args[1];
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.LINK = select, data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["GKV", "güvenlikişi", "güvenlikullanıcı", "guvenlikisi", "guvenliKisi", "gkv"].some(y => y === sec)) {
                let select = message.mentions.members.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                let arr = [];
                arr = data.GKV
                if (arr.some(x => x == select.id)) {
                    removeItemOnce(arr, select.id)
                    return data.GKV = arr, data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
                }
                return await data.GKV.push(`${select.id}`), await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));

            };
            if (["category", "Category", "kategori", "Kategori"].some(y => y === sec)) {
                let select = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                let arr = [];
                arr = data.PUBCategory
                if (arr.some(x => x == select.id)) {
                    removeItemOnce(arr, select.id)
                    return data.PUBCategory = arr, data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
                }
                return await data.PUBCategory.push(`${select.id}`), await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            
            if (["GRV", "guvenlirol", "güvenlirol", "grv"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                await data.GRV.push(`${select.id}`), await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["sohbet-kanal", "chat", "sohbetkanal", "genelchat"].some(y => y === sec)) {
                let select = message.mentions.channels.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.CHAT = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["register-kanal", "register", "registerchat", "register-chat"].some(y => y === sec)) {
                let select = message.mentions.channels.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.REGISTER = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            }
            if (["rol-ver-log"].some(y => y === sec)) {
                let select = message.mentions.channels.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.ROLEChannel = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            }
            if (["taglog-kanal", "taglog", "tagbilgi", "Taglog"].some(y => y === sec)) {
                let select = message.mentions.channels.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.TAGLOG = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["kurallar-kanal", "kurallar", "kurallarkanal", "kurallarchat", "rules", "rule"].some(y => y === sec)) {
                let select = message.mentions.channels.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.RULES = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["sleep-kanal", "sleep", "sleeproom", "sleepingroom"].some(y => y === sec)) {
                let select = message.mentions.channels.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.SLEEP = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };

            if (["vkyonetici", "vkyönetici", "vk-yönetici", "vampirköylü"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.VKAuthor = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["erkek", "Erkek", "erkekROL", "man", "Man"].some(y => y === sec)) {
                let select;
                if (message.mentions.roles.size >= 1) {
                    select = message.mentions.roles.map(r => r.id);
                } else {
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                    select = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
                }
                data.MAN = select, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["kadın", "kız", "kızROL", "kadınROL", "woman"].some(y => y === sec)) {
                let select;
                if (message.mentions.roles.size >= 1) {
                    select = message.mentions.roles.map(r => r.id);
                } else {
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                    select = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
                }
                data.WOMAN = select, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["kayıtsız", "unregister", "kayıtsızüye", "uregister", "kayitsiz"].some(y => y === sec)) {
                let select;
                if (message.mentions.roles.size >= 1) {
                    select = message.mentions.roles.map(r => r.id);
                } else {
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                    select = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
                }
                data.UNREGISTER = select, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["ekip", "teamrol", "ekiprol", "taglırol", "taglı", "team", "takım"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.TEAM = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["boost", "booster", "boostrol", "boosterrol"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.BOOST = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["jail", "jailed", "cezalı", "Jail", "Jailed", "Cezalı"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.JAIL = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["underworld"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.UNDERWORLD = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["reklam", "Reklam", "reklamrol", "Reklamrol", "ReklamRol", "REKLAM"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.REKLAM = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["mute", "muted", "Mute", "Muted"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.MUTED = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["vmute", "vmuted", "VMute", "VMuted", "VoiceMute", "sesmute", "SesMute", "Sesmute"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.VMUTED = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["yasaklıtag", "yasaklıtagrol", "bantag", "ban-tag", "yasaklı-tag", "ytag"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.BANTAG = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["şüpheli", "supheli", "şüphelihesap", "suphelihesap", "Şüpheli", "Supheli"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.SUPHELI = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["enaltyetkilirol", "en-alt-yetkili-rol", "enaltrol"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.EnAltYetkiliRol = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["genelrol", "genel-rol", "ozelrol", "globalrol"].some(y => y === sec)) {
                let select;
                if (message.mentions.roles.size >= 1) {
                    select = message.mentions.roles.map(r => r.id);
                } else {
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                    select = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
                }
                data.COMMANDAuthorized = select, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["kayıtsorumlusu", "kayit-sorumlusu", "kayıt-sorumlusu", "registerauthorized", "Kayıtçı", "kayitci"].some(y => y === sec)) {
                let select;
                if (message.mentions.roles.size >= 1) {
                    select = message.mentions.roles.map(r => r.id);
                } else {
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                    select = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
                }
                data.REGISTERAuthorized = select, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };

            if (["ustytler"].some(y => y === sec)) {
                let select;
                if (message.mentions.roles.size >= 1) {
                    select = message.mentions.roles.map(r => r.id);
                } else {
                    if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                    select = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
                }
                data.UstYetkiliRol = select, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["ust1"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.Ust1YetkiliRol = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["ust2"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.Ust2YetkiliRol = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["ust3"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.Ust3YetkiliRol = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["vkcezalı"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.VKCEZALI = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["dccezalı"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.DCCEZALI = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["stcezalı"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.STCEZALI = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };

            let arr = [];
            if (["panel", "ayar", "settings"].some(y => y === sec)) {
                arr.push(data)
                let embed = new MessageEmbed()
                    .setAuthor(message.guild.name, message.guild.iconURL({
                        dynamic: true
                    }))
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(conf.footer)
                    .setDescription(`
${arr.map(y => `
\`\`\`SERVER SETTINGS\`\`\`
**SunucuID:** (${y.guildID})
**TAG:** (${y.TAG ? y.TAG : "\`Kapalı\`"}) / (${y.TAG2 ? y.TAG2 : "\`Kapalı\`"})
**LINK:** (${y.LINK ? y.LINK : "\`Kapalı\`"})
**GKV:** (${y.GKV.length > 0 ? y.GKV.map(x => `<@${x}>`).slice(0, 5).join(","): "\`Kapalı\`"})
\`\`\`CHANNEL SETTINGS\`\`\`
**CHAT:** (${y.CHAT != "1" ? `<#${y.CHAT}>` : "\`Kapalı\`"})
**REGISTER:** (${y.REGISTER != "1" ? `<#${y.REGISTER}>` : "\`Kapalı\`"})
**TAGLOG:** (${y.TAGLOG != "1" ? `<#${y.TAGLOG}>` : "\`Kapalı\`"})
**RULES:** (${y.RULES != "1" ? `<#${y.RULES}>` : "\`Kapalı\`"})
**SLEEP:** (${y.SLEEP != "1" ? `<#${y.SLEEP}>` : "\`Kapalı\`"})
**ROLLOG** (${y.ROLEChannel != "1" ? `<#${y.ROLEChannel}>`: "\`Kapalı\`"})
\`\`\`ROLE SETTINGS\`\`\`
**VKAuthor:** ${y.VKAuthor != "1" ? `<@&${y.VKAuthor}>` : "\`Kapalı\`"}
**UNRegister:** ${y.UNREGISTER.length > 0 ? `${y.UNREGISTER.map(x => `<@&${x}>`).join(",")}` : "\`Kapalı\`"}
**MAN:** ${y.MAN.length > 0 ? `${y.MAN.map(x => `<@&${x}>`).join(",")}` : "\`Kapalı\`"}
**WOMAN:** ${y.WOMAN.length > 0 ? `${y.WOMAN.map(x => `<@&${x}>`).join(",")}` : "\`Kapalı\`"}
**TEAM:** ${y.TEAM != "1" ? `<@&${y.TEAM}>` : "\`Kapalı\`"}
**BOOST:** ${y.BOOST != "1" ? `<@&${y.BOOST}>` : "\`Kapalı\`"}
**JAIL:** ${y.JAIL != "1" ? `<@&${y.JAIL}>` : "\`Kapalı\`"}
**UNDERWORLD:** ${y.UNDERWORLD != "1" ? `<@&${y.UNDERWORLD}>` : "\`Kapalı\`"}
**REKLAM:** ${y.REKLAM != "1" ? `<@&${y.REKLAM}>` : "\`Kapalı\`"}
**SUPHELI:** ${y.SUPHELI != "1" ? `<@&${y.SUPHELI}>` : "\`Kapalı\`"}
**BANTAG:** ${y.BANTAG != "1" ? `<@&${y.BANTAG}>` : "\`Kapalı\`"}
**MUTED:** ${y.MUTED != "1" ? `<@&${y.MUTED}>` : "\`Kapalı\`"}
**VMUTED:** ${y.VMUTED != "1" ? `<@&${y.VMUTED}>` : "\`Kapalı\`"}
**VKCEZALI:** ${y.VKCEZALI ? `<@&${y.VKCEZALI}>` : "\`Kapalı\`"}
**DCCEZALI:** ${y.DCCEZALI ? `<@&${y.DCCEZALI}>` : "\`Kapalı\`"}
**STCEZALI:** ${y.STCEZALI ? `<@&${y.STCEZALI}>` : "\`Kapalı\`"}
**REGISTERAUTHORIZED:** ${y.REGISTERAuthorized.length  > 0 ? `${y.REGISTERAuthorized.map(x => `<@&${x}>`).join(",")}` : "\`Kapalı\`"}
**BOT COMMANDS:** ${y.COMMANDAuthorized.length  > 0 ? `${y.COMMANDAuthorized.map(x => `<@&${x}>`).join(",")}` : "\`Kapalı\`"}
**ENALTYETKILIROL:** ${y.EnAltYetkiliRol ? `<@&${y.EnAltYetkiliRol}>` : "\`Kapalı\`"}
`)}
`);
                message.channel.send(embed);
            };

            if (["yardım", "Yardım", "help", "Help"].some(y => y === sec)) {
                return message.channel.send(embed);
            };
            if (!sec) {
                return message.channel.send(embed);
            };

        });

    } else return;
}
exports.conf = {aliases: ["kurulum", "kur", "Setup", "SETUP", "Setup"]}
exports.help = {
    name: 'setup',
    description: "Bot kurmaya yarar.",
    usage: 'setup',
    kategori: "Bot Yapımcısı"
  };
function removeItemOnce(arr, value) { var index = arr.indexOf(value); if (index > -1) { arr.splice(index, 1); } return arr; }