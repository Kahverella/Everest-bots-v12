const { MessageEmbed } = require("discord.js");
const conf = client.ayarlar;
let Stat = require("../../models/stats");
module.exports.run = async (client, message, args, durum, kanal) => {
  if (!message.guild) return;

  (async() => {
    message.channel.send("Veriler yükleniyor...").then(async x => {
      Stat.find({guildID: message.guild.id}, {messageXP: 0, voiceLevel: 0, messageLevel: 0, _id: 0, __v: 0,ondort: 0,total: 0, yirmibir: 0, yirmisekiz: 0, otuzbes: 0, messageCategory: 0, voiceChannel: 0}, async (err, data) => {
          
        let sesArr = []
          data.map(x => {
            for (let [key, value] of Object.entries(x.voiceCategory)) {
              sesArr.push({
                Channel: key,
                Time: value
              });
            };
          });

          let sesKanal = {};
          sesArr.forEach((value) => {
            if (sesKanal[value.Channel]) sesKanal[value.Channel] += value.Time;
            else sesKanal[value.Channel] = value.Time
          });
          let sirali = Object.keys(sesKanal).sort((a, b) => sesKanal[b] - sesKanal[a]).splice(0, 10).map(e => ({ User: e, Value: sesKanal[e] }));
          sirali = sirali.map((user, index) => `\`${index+1}.\` ${message.guild.channels.cache.get(user.User) ? `<#${user.User}>` : "#deleted-channel"} \`${client.convertDuration(Number(user.Value))}\``);
          let mesajArr = []
          data.map(x => {
            for (let [k, v] of Object.entries(x.messageChannel)) {
              mesajArr.push({
                Channel: k,
                Time: v
              })
            }
          })
          let mesajKanal = {};
          mesajArr.forEach((value) => {
            if (mesajKanal[value.Channel]) mesajKanal[value.Channel] += value.Time;
            else mesajKanal[value.Channel] = value.Time
          })
          let sirali2 = Object.keys(mesajKanal).sort((a, b) => mesajKanal[b] - mesajKanal[a]).splice(0, 10).map(e => ({ User: e, Value: mesajKanal[e] }))
          sirali2 = sirali2.map((user, index) => `\`${index+1}\` <#${user.User}> \`${user.Value} mesaj\``)

          let sessira = 0;
          let benimSesSira = "\n";
          let sesMiktar = 0;
          let toplamSesSiralama = "\n"
          data.sort((uye1, uye2) =>
            Number(uye2.totalVoice) - Number(uye1.totalVoice)
          ).map((data, index) => {
            sesMiktar+=data.totalVoice;
            sessira++;
            if (data.userID == message.author.id) {
              benimSesSira = `**${index+1}.** ${message.author} \`${client.convertDuration(Number(data.totalVoice))}\``
            }
            if (sessira >= 11) return;
            toplamSesSiralama += `\`${index+1}.\` ${message.guild.members.cache.get(data.userID) ? message.guild.members.cache.get(data.userID).toString() : "@deleted-user"} \`${client.convertDuration(Number(data.totalVoice))}\`\n`
          })


          let CHATsira = 0;
          let benimMesajSira = "\n"
          let CHATMiktar = 0;
          let toplamCHATSiralama = "\n"
          data.sort((uye1, uye2) =>
            Number(uye2.totalMessage) - Number(uye1.totalMessage)
          ).map((data, index) => {
            CHATMiktar+=data.totalMessage
            CHATsira++
            if (data.userID == message.author.id) {
              benimMesajSira = `**${index+1}.** ${message.author} \`${data.totalMessage} mesaj\``
            }
            if (CHATsira >= 11) return;
            toplamCHATSiralama += `\`${index+1}.\` ${message.guild.members.cache.get(data.userID) ? message.guild.members.cache.get(data.userID).toString() : "@deleted-user"} \`${Number(data.totalMessage)} mesaj\`\n`
          })

          let embed = new MessageEmbed()
          .setColor("RANDOM")
          .setTimestamp()
          .setFooter(conf.footer)
          .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))

.addField(`**Toplam Ses Sıralaması**`, `
${toplamSesSiralama ? `${toplamSesSiralama}` : "```Datacenter'da kaydedilen bir veri görüntülenemedi!```"}`)

.addField(`**Toplam Mesaj Sıralaması**`, `
${toplamCHATSiralama ? `${toplamCHATSiralama}` : "```Datacenter'da kaydedilen bir veri görüntülenemedi!```"}`)

x.delete({ timout: 10 })
return message.channel.send(embed);
      });
    })
  })()
};

exports.conf = {
  aliases: ["Top", "TOP", "topstats", "stattop"]
};
exports.help = {
  name: "top"
};