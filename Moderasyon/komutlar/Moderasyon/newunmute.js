const ceza = require("../../models/ceza");
const disbut = require("discord-buttons");
const { MessageEmbed } = require("discord.js");
let sunucuayar = require("../../models/sunucuayar");
let muteInterval = require("../../models/muteInterval");
let vmuteInterval = require("../../models/vmuteInterval");
let jailInterval = require("../../models/jailInterval");
let reklamInterval = require("../../models/reklamInterval");
let underworldInterval = require("../../models/underworld");

module.exports.run = async (client, message, args, durum, kanal) => {

  const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!target) return message.channel.send(new MessageEmbed().setColor("BLACK").setDescription(`Lütfen bir kullanıcı belirtiniz!`)).then(msg => msg.delete({ timeout: 6000 }));
  
  let cezass = await ceza.findOne({});

   let vericik = await sunucuayar.findOne({});
    let data = await muteInterval.find({ userID: target.id });
    let datav = await vmuteInterval.find({ userID: target.id });
    let dataj = await jailInterval.find({ userID: target.id });
    let dataads = await reklamInterval.find({ userID: target.id });
    let dataunderworld = await underworldInterval.find({ userID: target.id });

    let underworld = new disbut.MessageButton().setStyle('blurple').setLabel('UnderWorld').setID('underworld').setDisabled(dataunderworld.length == 0);
    let jail = new disbut.MessageButton().setStyle('blurple').setLabel('Jail').setID('jail').setDisabled(dataj.length == 0);
    let cmute = new disbut.MessageButton().setStyle('blurple').setLabel('Chat Mute').setID('cmute').setDisabled(data.length == 0);
    let vmute = new disbut.MessageButton().setStyle('blurple').setLabel('Voice Mute').setID('vmute').setDisabled(datav.length == 0);
    let ads = new disbut.MessageButton().setStyle('blurple').setLabel('Reklam').setID('ads').setDisabled(dataads.length == 0);

    const question = await message.channel.send({ content: `${target} (\`${target.id}\`) adlı kişinin kaldırılmasını istediğiniz ceza türünü seçiniz!`, buttons: [underworld,jail,cmute,vmute,ads] });
    const collector = await question.createButtonCollector((inf) => inf.clicker.user.id === message.author.id, { time: 30000 });

    collector.on('collect', async (inf) => {
      if(inf.id == "cmute") { 
        let muteRol = vericik.MUTED;
        if (await client.permAyar(message.author.id, message.guild.id, "mute") || durum) {
            if (!target.roles.cache.get(muteRol)) return inf.reply("Kullanıcı zaten mutesiz ?");

            await muteInterval.deleteOne({ userID: target.id }).exec();
            await target.roles.remove(muteRol).then(async (user) => { inf.channel.send(`Başarılı bir şekilde <@${user.id}> adlı kullanıcının mutesini kaldırdınız.`)});
            await question.delete()
          }
      }
      if (inf.id == "vmute"){
        let muteRol = vericik.VMUTED;
        if (await client.permAyar(message.author.id, message.guild.id, "vmute") || durum) {
            await target.roles.remove(muteRol).catch(() => {});
            await vmuteInterval.deleteOne({userID: target.id}).exec();
            await target.voice.setMute(false).catch(() => {});
            await inf.channel.send(`Başarılı bir şekilde <@${target.id}> adlı kullanıcının ses mutesini kaldırdınız.`);
           await question.delete()
        }
      }
      if (inf.id == "jail"){
        let jailRol = vericik.JAIL;
        let kayitsizUyeRol = vericik.UNREGISTER
        if (await client.permAyar(message.author.id, message.guild.id, "jail") || durum) {
          if (!target.roles.cache.get(jailRol)) return inf.reply("Kullanıcı zaten jailsiz ?")
              await target.roles.set(kayitsizUyeRol)
              inf.channel.send(`Başarılı bir şekilde <@${target.id}> adlı kullanıcının jailini kaldırdınız.`)
              await ceza.updateMany({ "userID": target.id, "Ceza": "JAIL" }, { Sebep: "AFFEDILDI", Bitis: Date.now() });
              await jailInterval.deleteOne({userID: target.id})
              await question.delete()
        }
      }
      if (inf.id == "underworld"){
        let underworldROl = vericik.UNDERWORLD;
        let kayitsizUyeRol = vericik.UNREGISTER
        if (await client.permAyar(message.author.id, message.guild.id, "underworld") || durum) {
          if (!target.roles.cache.get(underworldROl)) return inf.reply("Kullanıcı zaten jailsiz ?")
              await target.roles.set(kayitsizUyeRol)
              inf.channel.send(`Başarılı bir şekilde <@${target.id}> adlı kullanıcının underworldunu kaldırdınız.`)
              await ceza.updateMany({ "userID": target.id, "Ceza": "UNDERWORLD" }, { Sebep: "AFFEDILDI", Bitis: Date.now() });
              await underworldInterval.deleteOne({userID: target.id})
              await question.delete()
        }
      }
      if (inf.id == "ads"){
        let jailRol = vericik.REKLAM;
        let kayitsizUyeRol = vericik.UNREGISTER
        if (await client.permAyar(message.author.id, message.guild.id, "reklam") || durum) {
          if (!target.roles.cache.get(jailRol)) return inf.reply("Kullanıcı zaten jailsiz ?")
          await target.roles.set(kayitsizUyeRol)
          await target.setNickname("• İsim | Yaş")
          inf.channel.send(`Başarılı bir şekilde <@${target.id}> adlı kullanıcının reklam jailini kaldırdınız.`)
          await ceza.updateMany({ "userID": target.id, "Ceza": "REKLAM" }, { Sebep: "AFFEDILDI", Bitis: Date.now() });
          await reklamInterval.deleteOne({ userID: target.id })
          await question.delete()
      }
    }
      await inf.reply.defer();
    
})
}
exports.conf = {
    aliases: ['aff',"unmute","unvmute","unjail","unreklam","ununderworld"]
}
exports.help = {
    name: 'af',
    description: "Botu yeniden başlatmaya yarar",
    usage: 'newunmute',
    kategori: "Bot Yapımcısı"
  };