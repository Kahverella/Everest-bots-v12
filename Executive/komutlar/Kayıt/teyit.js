const { MessageEmbed } = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let teyit = require("../../models/stats");
let sunucuayar = require("../../models/sunucuayar");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
    let datas = await sunucuayar.findOne({});
    let kayitSorumlusu = datas.REGISTERAuthorized;
    let jailSorumluRol = datas.JAILAuthorized;

    if (message.member.permissions.has(8) || message.guild.roles.cache.some(rol => kayitSorumlusu.some(rol2 => rol === rol2)) || message.guild.roles.cache.some(rol => jailSorumluRol.some(rol2 => rol === rol2)) || durum) {
       
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
        let data = await teyit.findOne({ userID: target.id });
        let toplam = data.Man + data.Woman;

        let embed = new MessageEmbed({
            color: "RANDOM",
            author: {
                name: `${message.author.tag}`,
                iconURL: `${message.author.avatarURL({ dynamic: true })}`
            },
            description: `Toplam **${data.Man + data.Woman}** kayıta sahip! (Erkek: **${data.Man}**, Kadın: **${data.Woman}**)`,
            footer: { text: conf.footer }
        });

        message.channel.send(embed)

    } else return;
}
exports.conf = {
    aliases: ["teyitbilgi","tb","teyitlerim"]
}
exports.help = {
    name: 'teyitbilgi',
    description: "Sunucuda kaç kayıt yapıldığını gösterir.",
    usage: '@etiket',
    kategori: "Yetkili Komutları"
  };
