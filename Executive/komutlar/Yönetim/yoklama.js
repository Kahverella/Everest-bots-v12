const {
  MessageEmbed,
  Discord
} = require("discord.js");
let yoklama = require("../../models/yoklama");
let sunucuayar = require("../../models/sunucuayar");

module.exports.run = async (client, message, args, durum, kanal) => {
  if (!message.guild) return;
  let data = await sunucuayar.findOne({ guildID: message.guild.id });
let voiceChannel = message.member.voice.channel;
let katıldıRolü = "894954877602635864"
let katılmadıRolü = "911381269307359262"
let botCommand = data.EnAltYetkiliRol

if(args[0]=="all") {
await message.guild.roles.cache.get(katıldıRolü).members.map(x=> x.roles.remove(katıldıRolü))
await message.guild.roles.cache.get(katılmadıRolü).members.map(x=> x.roles.remove(katılmadıRolü))
message.react(client.emojis.cache.find(x => x.name === "kck_tik"))
return
}
if (!voiceChannel) return message.channel.send(`Bu komutu kullanabilmek için **toplantı** kanalında bulunmanız gerekmektedir.`)
if (voiceChannel.members.size < 10) return message.channel.send("Bu komut için ses kanalında en az 10 kişi olmalı!");

let seste_olanlar = message.guild.roles.cache.get(botCommand).members.filter(member => member.roles.cache.get(botCommand)&& member.voice.channel);
let seste_olmayanlar = message.guild.roles.cache.get(botCommand).members.filter(member => member.roles.cache.get(botCommand) && !member.voice.channel);

let yoklamaveri = await yoklama.findOne({guildID: message.guild.id}) || {Katılanlar: [],Katılmayanlar: []};

seste_olanlar.map(async veri => {
      await veri.roles.add(katıldıRolü)
      await veri.roles.remove(katılmadıRolü)

    if (yoklamaveri.Katılanlar.includes(veri.id)) return;
    if (yoklamaveri.Katılmayanlar.includes(veri.id)) return yoklama.updateOne({guildID: message.guild.id}, {$pull: {Katılmayanlar: veri.id}}, {upsert: true,setDefaultsOnInsert:true}).exec();
    yoklama.updateOne({guildID: message.guild.id}, {$push: {Katılanlar: veri.id}}, {upsert: true,setDefaultsOnInsert:true}).exec();

})
  seste_olmayanlar.map(async veri => {
    if(veri.roles.cache.get(katıldıRolü)) {
        veri.roles.remove(katıldıRolü)
    }
    await veri.roles.add(katılmadıRolü)
        
    if (yoklamaveri.Katılmayanlar.includes(veri.id)) return;
    if (yoklamaveri.Katılanlar.includes(veri.id)) return yoklama.updateOne({guildID: message.guild.id}, {$pull: {Katılanlar: veri.id}}, {upsert: true,setDefaultsOnInsert:true}).exec();
    yoklama.updateOne({guildID: message.guild.id}, {$push: {Katılmayanlar: veri.id}}, {upsert: true,setDefaultsOnInsert:true}).exec();
  
})

  message.channel.send(`${client.emojis.cache.find(res => res.name === "yildiz")} **Toplantı Verileri Kaydedilmiştir!** ${client.emojis.cache.find(res => res.name === "yildiz")}
Önceki Toplantı: ${yoklamaveri.Katılanlar.length}
Bu Toplantı: ${seste_olanlar.size}
  
Bu Toplantıya Katılanlar: (${seste_olanlar.size})
${seste_olanlar.map(x => `<@${x.id}>`)}`,{split:true}).then(async x => {

message.channel.send(`Bu Toplantıya Katılmayanlar: (${seste_olmayanlar.size})
${seste_olmayanlar.map(x => `<@${x.id}>`)}`,{split:true})

})

}
exports.conf = {
  aliases: ["toplantı"]
};
exports.help = {
  name: 'yoklama',
  description: "Toplantı yoklama yapar.",
  usage: '',
  kategori: "Yönetici Komutları"
};