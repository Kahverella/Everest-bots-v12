const { MessageEmbed } = require("discord.js");
const conf = client.ayarlar
let teyit = require("../../models/teyit");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;

   if (durum || message.member.permissions.has(8)) {

    let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    let teyitData = await teyit.findOne({ userID: target.id }) || { userName: [] };
    if (teyitData.userName.length <= 0) return message.channel.send("İsim geçmişi bulunamadı!");

    let embed = new MessageEmbed({
        color: "RANDOM",
        description: `
            ${target.toString()} adlı kişinin son **10** isim geçmişi\n
           **[${teyitData.userName.length}]** adet isim geçmişi bulundu.\n
            ${teyitData.userName.reverse().splice(0, 10).join("\n")}`,
        footer: { 
            text: client.ayarlar.footer 
        }
    });

     await message.channel.send(embed).then(message => message.delete({ timeout: 10000 }));

   }
}
exports.conf = {
    aliases: ["İsimler", "names"]
}
exports.help = {
    name: 'isimler',
    description: "Belirtilen üyenin sunucudaki önceki isimlerini gösterir.",
    usage: '@etiket',
    kategori: "Yetkili Komutları"
  };