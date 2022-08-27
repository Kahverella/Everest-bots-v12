const { MessageEmbed, Discord } = require("discord.js");
const { MessageButton } = require("discord-buttons");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;
    if (kanal) return
    
    if (!message.member.voice.channel) return message.channel.send(`Bir ses kanalında olman gerek`);
    let kullanici = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!kullanici) return message.reply("Lütfen bir kullanıcı etiketleyiniz veya ID'si giriniz.");
    if (!kullanici.voice.channel) return message.channel.send("Bu Kullanıcı Bir Ses Kanalında Değil");
    if (message.member.voice.channel.id === kullanici.voice.channel.id) return message.channel.send("Zaten Aynı Kanaldasınız.");

        let yes = new MessageButton().setID("yes").setLabel("Evet").setStyle("green");
        let no = new MessageButton().setID("no").setLabel("Hayır").setStyle("red");
        let messagesakso = new MessageEmbed().setColor("RANDOM").setDescription(`${message.author} adlı kişi seni yanına çekmek istiyor onay veriyor musun ?`)

        let allah = await message.channel.send(messagesakso, { buttons: [ yes, no ]})

        let filter = (button) => button.clicker.user.id === kullanici.id;
        let collector = allah.createButtonCollector(filter, { time: 30000 });
        
        collector.on('collect', async (button) => {
          if(button.id == "yes") {
            await allah.edit(new MessageEmbed().setColor("RANDOM").setDescription(`${message.author}, ${kullanici} odaya gelme isteğini onayladı.`)).then(x => x.delete({ timeout: 100 }))
            message.member.voice.setChannel(kullanici.voice.channel.id);
          } 
           if(button.id == "no") {
            await allah.edit(new MessageEmbed().setColor("RANDOM").setDescription(`${message.author}, ${kullanici} odaya gelme isteğini reddetti.`)).then(x => x.delete({ timeout: 2000 }))
          }
        })
          
}
exports.conf = {aliases: ["git","go","Git"]}
exports.help = {name: 'git'}