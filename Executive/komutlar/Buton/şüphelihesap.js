const disbut = require("discord-buttons");
let sunucuayar = require("../../models/sunucuayar");

module.exports.run = async (client, message, args, durum, kanal) => {

    if (!client.ayarlar.sahip.some(x => x == message.author.id)) return;

    let şüpheli = new disbut.MessageButton().setStyle('red').setLabel('Şüpheliden Çıkmak İçin Tıkla!').setID('şüpheli')
    message.channel.send(`Karantina durumunu kontrol ederek hesabının açılış tarihi 7 günü geçtiyse buradan otomatik bir şekilde kendini kurtarabilirsin :()`, { buttons: [ şüpheli ] })
    
    }
    client.on('clickButton', async (button) => {
        let data = await sunucuayar.findOne({});
        let kayitsizRol = data.UNREGISTER;

        if (button.id === 'şüpheli') {
            if (!button.clicker.member.roles.cache.get(data.SUPHELI)) {
                await button.reply.think(true);
                await button.reply.edit("Şüpheli bölümünde değilsiniz!.") 
            return;
        }
     
       let guvenilirlik = Date.now() - button.clicker.member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7;

       if (guvenilirlik) {
        await button.reply.think(true);
        await button.reply.edit("Hesabınız karantinadan çıkmak için uygun değildir.")
    } else {
        await button.reply.think(true);
        await button.reply.edit("Karantinadan çıkarıldınız.")
        await button.clicker.member.roles.set(kayitsizRol)
      } 
   }
})
     
  
exports.conf = {
    aliases: []
}
exports.help = {
    name: 'deneme'
}