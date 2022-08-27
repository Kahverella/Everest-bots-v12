const { MessageEmbed } = require("discord.js");
const conf = client.ayarlar;
let teyit = require("../../models/teyit");
let sunucuayar = require("../../models/sunucuayar");
let otokayit = require("../../models/otokayit");
let puansystem = require("../../models/puansystem");
let limit = new Map();
let sure = new Map();
const ms = require("ms");

module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;

    let data = await sunucuayar.findOne({ guildID: message.guild.id });
    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    let erkekRol = data.MAN;
    let kadinRol = data.WOMAN;
    let unRegisterRol = data.UNREGISTER;
    let registerChannel = data.REGISTERChannel;
    let tag = data.TAG;
    let tag2 = data.TAG2;
    let kayitSorumlusu = data.REGISTERAuthorized;
    let ekipRol = data.TEAM;
    let chatKANAL = data.CHAT;
    let boost = data.BOOST;
    if (!message.guild.roles.cache.get(erkekRol[0]) &&
        !message.guild.roles.cache.get(kadinRol[0]) &&
        !message.guild.roles.cache.get(unRegisterRol[0]) &&
        !message.guild.roles.cache.get(kayitSorumlusu[0]) &&
        !client.channels.cache.get(registerChannel) &&
        !tag && !tag2) return message.reply(`Lütfen kurulum sistemini tamamen bitiriniz \`${conf.prefix[0]}setup help\``);
        if (message.member.permissions.has(8) || message.member.roles.cache.some(e => kayitSorumlusu.some(x => x == e)) || message.member.permissions.has(8)) {

        let kntrl = limit.get(message.author.id)
        let sre = sure.get(message.author.id)
        if (kntrl >= 5 && sre > Date.now() && !message.member.permissions.has(8) && !message.member.roles.cache.some(rol => data.MUTEAuthorized.includes(rol.id))) {
message.channel.send("Kısa sürede 5 den fazla kayıt yaptığınız için yetkileriniz çekildi.")
            return message.member.roles.remove(user.roles.cache.filter(rol => message.guild.roles.cache.get(data.TEAM).position <= rol.position && !rol.managed))
        }
        if (!sre) {
            sure.set(message.author.id, Date.now()+ms("30s"))
        }
        
        limit.set(message.author.id, (limit.get(message.author.id) || 0) +1)
        setTimeout(() => {
            limit.delete(message.author.id)
            sure.delete(message.author.id)
        }, ms("30s"));
    
        if (!target) return message.reply("Lütfen bir üye belirtiniz.");
        unreg = unRegisterRol;
        if (!args[1]) return message.reply("Lütfen bir isim belirtiniz.");

        let name = args[1][0].toUpperCase() + args[1].substring(1);
        let age = Number(args[2]);
        if (!age) return message.reply("Lütfen bir yaş belirtiniz.");
        if (message.member.roles.highest.position <= target.roles.highest.position) return message.reply(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`);
        
        if (target.roles.cache.some(rol => erkekRol.includes(rol.id))) return message.reply(`Kayıtlı bir üyeyi kayıt edemezsiniz.`)
        if (target.roles.cache.some(rol => kadinRol.includes(rol.id))) return message.reply(`Kayıtlı bir üyeyi kayıt edemezsiniz.`)

        let autoLogin = await puansystem.findOne({ guildID: message.guild.id });
        target.user.username.includes(tag) ? erkekRol.push(ekipRol) : erkekRol = erkekRol;

            await target.roles.remove(unreg).then(async x => {
                await target.roles.set(target.roles.cache.has(boost) ? [boost, ...erkekRol] : [...erkekRol])
                await message.guild.member(target.id).setNickname(`${target.user.username.includes(tag) ? tag : tag2 ? tag2 : tag} ${name} | ${age}`).then(x=> message.react(client.emojis.cache.find(res => res.name === "kck_tik")) )
				
                if (target.roles.cache.some(rol => kadinRol.some(rol2 => rol.id == rol2))) {
                    kadinRol.forEach(async (res, i) => {
                        setTimeout(async () => {
                            await target.roles.remove(res)
                        }, i * 1000);
                    })
                };
                await teyit.updateOne({ userID: target.id }, { $push: { userName: `**[ERKEK]:** \`${target.user.username.includes(tag) ? tag : tag2 ? tag2 : tag} ${name} | ${age}\` - [<t:${Math.floor(Date.now() / 1000)}:R>]` } }, { upsert: true }).exec();

                let embed = new MessageEmbed({
                    color: "RANDOM",
                    author: {
                        name: `${message.author.tag}`,
                        iconURL: `${message.author.avatarURL({ dynamic: true })}`
                    },
                    description: `${target} kullanıcısı **Erkek** olarak kayıt edildi.`,
                    footer: { text: client.ayarlar.footer }
                });

                await message.channel.send(embed).then(message => message.delete({ timeout: 10000 }))
            
                if (autoLogin.AutoLogin.Type == true) {
                    await otokayit.updateOne({ userID: target.id }, {
                        $set: {
                            userID: target.id,
                            roleID: erkekRol,
                            name: name,
                            age: age
                        }
                    }, { upsert: true }).exec();
                }
                client.channels.cache.get(chatKANAL).send(client.ayarlar.chatMesajı.replace("-member-", target)).then(msg => msg.delete({
                    timeout: 1000 * 15
                }))
                client.dailyMission(message.author.id, "teyit", 1, 3)
                client.easyMission(message.author.id, "teyit", 1)
                client.addAudit(message.author.id, 1, "Erkek");
            })
    }}

exports.conf = {
    aliases: ["e", "Erkek", "ERKEK", "Man", "man"]
}
exports.help = {
    name: 'erkek',
    escription: "Erkek üyeleri kayıt eder.",
    usage: '@etiket [isim] [yaş]',
    kategori: "Yetkili Komutları"
};