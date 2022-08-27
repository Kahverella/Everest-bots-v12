const {
    MessageEmbed,
    Discord
} = require("discord.js");
const conf = client.ayarlar
let mongoose = require("mongoose");
let sunucuayar = require("../../models/sunucuayar");
let yetkiDATA = require("../../models/yetkili");
const hanedan = require("../../models/hanedanlik");
let Stat2 = require("../../models/stats");
const disbut = require("discord-buttons");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    
	let sdata = await sunucuayar.findOne({guildID: message.guild.id});
    if (durum) {
     
		
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply("Lütfen bir kullanıcı etiketleyiniz!");
        if (Date.now() - target.user.createdAt <= 1000*60*60*24*7) return message.reply("Lütfen 7 günden kısa sürede açılan hesapları yetkili yapmayı deneyiniz.").then(x => x.delete({timeout: 5000}));
      
        await yetkiDATA.findOne({
            userID: target.id,
            Durum: "stat"
        });
        
                
                let data = await sunucuayar.findOne({
                    guildID: message.guild.id
                });
            
                let EnAltYetkiliRol = data.EnAltYetkiliRol;
                const roller = [
                  "911387752426254397",   
                  "911387751704850484"
                ];
                if(target.roles.cache.find(rol => roller.some(rol2 => rol.name == rol2 || rol.id == rol2))) return await message.reply(`Belirtilen kullanıcının yetkisi bulunmaktadır!`);

                const yetki1 =  new disbut.MessageButton().setID("yetki1").setLabel("1").setStyle("red");
                const yetki2 =  new disbut.MessageButton().setID("yetki2").setLabel("2").setStyle("red");
        
        let embed =  new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(` ${target} kullanıcısına verilecek rolü seçiniz!
        
        
        ${roller.map((r, i) => `**${i+1}.** <@&${r}>, <@&${EnAltYetkiliRol}>`).join("\n")}`)

                let msj = await message.channel.send(embed, {buttons: [yetki1, yetki2]});
                let filter = (btn) => btn.clicker.id === message.author.id;
                let collector = msj.createButtonCollector(filter, {time: 1000*60*60*24});

                

                collector.on("collect", async (button) => {
                    if (button.id === "yetki1") {
                        if(target.roles.cache.find(rol => roller.some(rol2 => rol.name == rol2 || rol.id == rol2))) return await button.reply.send(`${target} Kullanıcısının yetkisi bulunmaktadır!`)

                    hanedan.findOne({userID: message.author.id, guildID:client.ayarlar.sunucuId}, (err, hanedanData) => {
                        if (!hanedanData) return;
                        hanedan.updateOne({userID: message.author.id, guildID: client.ayarlar.sunucuId}, {
                          $inc: {
                            [`Yetkili`]: 1,
                          }
                        }, {upsert: true}).exec()
                    });
					if (sdata.Etkinlik === true) {
						await Stat2.updateOne({userID: message.author.id}, {$inc: {["puan"]: 60}})
					}
                    await yetkiDATA.updateMany({userID: target.id}, {$set: {authorID: message.author.id}}, {upsert: true})
                    await Stat2.updateOne({userID: message.author.id}, {$inc: {["puan"]: 30, ["coin"]:45}})

                    await target.roles.add([roller[0], EnAltYetkiliRol])

                        await button.reply.send(`${target} adlı kişiye başarılı bir şekilde rolleri verildi.`);
                    }
                
                
                    if (button.id === "yetki2") {
                        if(target.roles.cache.find(rol => roller.some(rol2 => rol.name == rol2 || rol.id == rol2))) return await button.reply.send(`${target} Kullanıcısının yetkisi bulunmaktadır!`)

                        hanedan.findOne({userID: message.author.id, guildID:client.ayarlar.sunucuId}, (err, hanedanData) => {
                            if (!hanedanData) return;
                            hanedan.updateOne({userID: message.author.id, guildID: client.ayarlar.sunucuId}, {
                              $inc: {
                                [`Yetkili`]: 1,
                              }
                            }, {upsert: true}).exec()
                        });
                        if (sdata.Etkinlik === true) {
                            await Stat2.updateOne({userID: message.author.id}, {$inc: {["puan"]: 60}})
                        }
                        await yetkiDATA.updateMany({userID: target.id}, {$set: {authorID: message.author.id}}, {upsert: true})
                        await Stat2.updateOne({userID: message.author.id}, {$inc: {["puan"]: 30, ["coin"]:45}})
    
                        await target.roles.add([roller[1], EnAltYetkiliRol])
    
                            await button.reply.send(`${target} adlı kişiye başarılı bir şekilde rolleri verildi.`);
                        }})
                
             


    } else return;
}



exports.conf = {
    aliases: ["yetkilix"]
}
exports.help = {
    name: 'Yetkilix',
    description: "Sunucudaki özel rolleri kontrol eder.",
    usage: 'Yetkilix',
  };
