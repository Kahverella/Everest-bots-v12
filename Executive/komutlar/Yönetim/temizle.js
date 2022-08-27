const conf = client.ayarlar
let mongoose = require("mongoose");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    
    if (message.member.permissions.has(8) || durum) {
        const sayi = args[0]
        if (!sayi) return message.reply("En Az `1 - 100` Arasında Bir Tam Sayı Değeri Girmelisiniz.")
        if (sayi >= 101) return message.reply("En Az `1 - 100` Arasında Bir Tam Sayı Değeri Girmelisiniz.")
        let messages = await message.channel.messages.fetch({ limit: sayi });
        let mesaj = await message.channel.bulkDelete(messages, true);
        if (!mesaj.size) {
            return message.reply("En Az `1 - 100` Arasında Bir Tam Sayı Değeri Girmelisiniz.").then(x => x.delete({ timeout: 5000 }))
        };
        message.reply(`${mesaj.size} Adet Mesaj Başarılı Bir Şekilde Silindi`).then(x => x.delete({ timeout: 100 }))
    } else return
};
exports.conf = {aliases: ["sil", "clear", "clean", "oglumsohbettemizlendi"]}
exports.help = {
    name: 'temizle',
    description: "Girilen miktarda yazı siler.",
    usage: 'miktar',
    kategori: "Yönetim Komutları"
  };