const { MessageEmbed,Discord } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let eventayar = require("../../models/eventsetup");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    if (client.ayarlar.sahip.some(x => x == message.author.id)) {

        let sec = args[0]
        let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
            .setFooter(conf.footer)
            .setTimestamp()  
            .setDescription(`
\`\`\`fix\nEtkinlik/Çekiliş Kurulum\`\`\`
\`${conf.prefix[0]}esetup etkinlik @EtkinlikRole\`
\`${conf.prefix[0]}esetup çekiliş @ÇekilişRole\`
\`\`\`fix\nİlişki Kurulum\`\`\`
\`${conf.prefix[0]}esetup alone @AloneRole\`
\`${conf.prefix[0]}esetup lovers @LoversRole\`
\`\`\`fix\nBurç Kurulum\`\`\`
\`${conf.prefix[0]}esetup balık @Balık\`
\`${conf.prefix[0]}esetup kova @Kova\`
\`${conf.prefix[0]}esetup oğlak @Oğlak\`
\`${conf.prefix[0]}esetup yay @Yay\`
\`${conf.prefix[0]}esetup akrep @Akrep\`
\`${conf.prefix[0]}esetup terazi @Terazi\`
\`${conf.prefix[0]}esetup basak @Basak\`
\`${conf.prefix[0]}esetup aslan @Aslan\`
\`${conf.prefix[0]}esetup yengec @Yengec\`
\`${conf.prefix[0]}esetup ikizler @İkizler\`
\`${conf.prefix[0]}esetup boğa @Boğa\`
\`${conf.prefix[0]}esetup koç @Koç\`
`)

     let data = await eventayar.findOne({ guildID: conf.sunucuId })
            if (["etkinlik", "Etkinlik"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.ETKINLIK = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["çekiliş","Çekiliş","Cekiliş"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.CEKILIS = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };

            if (["alone", "Alone"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.ALONE = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["lovers", "Lovers"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.LOVERS = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };

            if (["balık","Balık","balik"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.BALIK = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["kova","Kova"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.KOVA = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["yay", "Yay"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.YAY = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["akrep","Akrep"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.AKREP = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["terazi","Terazi"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.TERAZI = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["başak","Başak","basak"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.BASAK = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["aslan","Aslan"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.ASLAN = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["yengeç","Yengeç","yengec"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.YENGEC = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["ikizler","İkizler"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.IKIZLER = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["boğa","boga","Boğa"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.BOGA = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
            };
            if (["koç","Koç","koc"].some(y => y === sec)) {
                let select = message.mentions.roles.first();
                if (!select) return message.react(client.emojis.cache.find(res => res.name === "kck_iptal"));
                data.KOC = select.id, await data.save(), message.react(client.emojis.cache.find(res => res.name === "kck_tik"));
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
\`\`\`fix\nEtkinlik/Çekiliş Kurulum\`\`\`
**SunucuID:** (${message.guild.id})
**Etkinlik:** ${y.ETKINLIK != "1" ? `<@&${y.ETKINLIK}>` : "\`Rol Girilmemiş\`"}
**Çekiliş:** ${y.CEKILIS != "1" ? `<@&${y.CEKILIS}>` : "\`Rol Girilmemiş\`"}
\`\`\`fix\nİlişki Kurulum\`\`\`
**Alone:** ${y.ALONE != "1" ? `<@&${y.ALONE}>` : "\`Rol Girilmemiş\`"}
**Lovers:** ${y.LOVERS != "1" ? `<@&${y.LOVERS}>` : "\`Rol Girilmemiş\`"}
\`\`\`fix\nBurç Kurulum\`\`\`
**Balık:** ${y.BALIK != "1" ? `<@&${y.BALIK}>` : "\`Rol Girilmemiş\`"}
**Kova:** ${y.KOVA != "1" ? `<@&${y.KOVA}>` : "\`Rol Girilmemiş\`"}
**Oğlak:** ${y.OGLAK != "1" ? `<@&${y.OGLAK}>` : "\`Rol Girilmemiş\`"}
**Yay:** ${y.YAY != "1" ? `<@&${y.YAY}>` : "\`Rol Girilmemiş\`"}
**Akrep:** ${y.AKREP != "1" ? `<@&${y.AKREP}>` : "\`Rol Girilmemiş\`"}
**Terazi:** ${y.TERAZI != "1" ? `<@&${y.TERAZI}>` : "\`Rol Girilmemiş\`"}
**Başak:** ${y.BASAK != "1" ? `<@&${y.BASAK}>` : "\`Rol Girilmemiş\`"}
**Aslan:** ${y.ASLAN != "1" ? `<@&${y.ASLAN}>` : "\`Rol Girilmemiş\`"}
**Yengeç:** ${y.YENGEC != "1" ? `<@&${y.YENGEC}>` : "\`Rol Girilmemiş\`"}
**İkizler:** ${y.IKIZLER != "1" ? `<@&${y.IKIZLER}>` : "\`Rol Girilmemiş\`"}
**Boğa:** ${y.BOGA != "1" ? `<@&${y.BOGA}>` : "\`Rol Girilmemiş\`"}
**Koç:** ${y.KOC != "1" ? `<@&${y.KOC}>` : "\`Rol Girilmemiş\`"}
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

    } else return;
}
exports.conf = {aliases: ["ekurulum", "ekur", "eSetup", "eSETUP", "eSetup"]}
exports.help = {
    name: 'essetup',
    description: "Bot kurmaya yarar.",
    usage: 'esetup',
    kategori: "Bot Yapımcısı"
  };
function removeItemOnce(arr, value) { var index = arr.indexOf(value); if (index > -1) { arr.splice(index, 1); } return arr; }