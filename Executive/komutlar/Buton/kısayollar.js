const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord-buttons')
const client = global.client;
const conf = client.ayarlar;

let Stat = require("../../models/stats");
let Database = require("../../models/invite");
let ceza = require("../../models/ceza");
const profilManager = require("../../models/profilmanager");

module.exports.run = (client, message, args, durum, kanal) => {

    if (durum) {

      const row = new MessageActionRow({
        components: [
          new MessageButton({
            label: 'Top Ses / Mesaj Aktifliği',
            custom_id: 'sesmesaj',
            disabled: false,
            style: 'green'
          }),
          new MessageButton({
            label: 'Top Teyit Miktarı',
            custom_id: 'teyit',
            disabled: false,
            style: 'green'
          }),
          new MessageButton({
            label: 'Top Davet Miktarı',
            custom_id: 'davet',
            disabled: false,
            style: 'green'
          }),
          new MessageButton({
            label: 'Ceza Bilgilerim',
            custom_id: 'sicil',
            disabled: false,
            style: 'red'
          })
        ]
      })

  message.channel.send(`**${client.ayarlar.tag} ${client.ayarlar.sunucuAdı}** adlı sunucudaki kısayol komutları!`, { components: [row] })
    }
  };
  

  client.on('clickButton', async (button) => {
    if (button.id === 'sesmesaj') {
        Stat.find({guildID: button.guild.id}, {messageXP: 0, voiceLevel: 0, messageLevel: 0, _id: 0, __v: 0,ondort: 0,total: 0, yirmibir: 0, yirmisekiz: 0, otuzbes: 0, messageCategory: 0, voiceChannel: 0}, async (err, data) => {
            let sessira = 0;
            let sesMiktar = 0;
            let toplamSesSiralama = "\n"
        data.sort((uye1, uye2) => Number(uye2.totalVoice) - Number(uye1.totalVoice)).map((data, index) => {
          sesMiktar += data.totalVoice;
          sessira++;
          if (sessira >= 11) return;
          toplamSesSiralama += `\`${index+1}.\` ${button.guild.members.cache.get(data.userID) ? button.guild.members.cache.get(data.userID).toString() : "@deleted-user"} \`${client.convertDuration(Number(data.totalVoice))}\`\n`
        })

        let CHATsira = 0;
        let CHATMiktar = 0;
        let toplamCHATSiralama = "\n"
        data.sort((uye1, uye2) => Number(uye2.totalMessage) - Number(uye1.totalMessage)).map((data, index) => {
          CHATMiktar += data.totalMessage
          CHATsira++
          if (CHATsira >= 11) return;
          toplamCHATSiralama += `\`${index+1}.\` ${button.guild.members.cache.get(data.userID) ? button.guild.members.cache.get(data.userID).toString() : "@deleted-user"} \`${Number(data.totalMessage)} mesaj\`\n`
        })

        let embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()
        .setAuthor(`${client.ayarlar.tag} ${client.ayarlar.sunucuAdı}`, button.guild.iconURL({dynamic:true}))
        .setFooter(conf.footer)
.addField(`**Toplam Ses Sıralaması**`, `
${toplamSesSiralama ? `${toplamSesSiralama}` : "```Datacenter'da kaydedilen bir veri görüntülenemedi!```"}`)
.addField(`**Toplam Mesaj Sıralaması**`, `
${toplamCHATSiralama ? `${toplamCHATSiralama}` : "```Datacenter'da kaydedilen bir veri görüntülenemedi!```"}`)

await button.reply.think(true);
await button.reply.edit(embed)
    })
    }
    if (button.id === 'teyit') {
        let data = await Stat.find({});
        teyitData = data.map(veri => {
          return {
              Id: veri.userID,
              Total: veri.Man+veri.Woman,
              Erkek: veri.Man,
              Kadin: veri.Woman
          }}).sort((a, b) => b.Total - a.Total).map((user, index) => `\`${index+1}.\` <@${user.Id}> (\`Erkek: ${user.Erkek} Kadin: ${user.Kadin} Toplam: ${user.Total}\`)`).splice(0, 30).join("\n")
        let teyitEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setAuthor(`${client.ayarlar.tag} ${client.ayarlar.sunucuAdı}`, button.guild.iconURL({ dynamic: true }))
            .setFooter(conf.footer)
            .setDescription(`**Teyit Tablosu**

${teyitData}`)
            await button.reply.think(true);
            await button.reply.edit(teyitEmbed)
    }

    if (button.id === 'sicil') {
        let data = await ceza.find({ userID: button.clicker.id })
        let sicil = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`${client.ayarlar.tag} ${client.ayarlar.sunucuAdı}`,button.guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`**${button.clicker.user.tag}** adlı kullanıcının sicili aşağıda yer almaktadır!
        
        **Ceza-i İşlemler (Son 10)**

        ${data.reverse().slice(0,10).map((data, index) => `**[${data.Ceza.toUpperCase()}]** - **${new Date(Number(data.Atilma)).toTurkishFormatDate()}** tarihinde \`${data.Sebep}\` nedeniyle ${button.guild.members.cache.has(data.Yetkili) ? button.guild.members.cache.get(data.Yetkili).toString() : data.Yetkili} tarafından cezalandırıldı!`).join("\n")}`)
        await button.reply.think(true); 
        await button.reply.edit(sicil)
    }

    if (button.id === 'level') {
    const rankData = await profilManager.find({}).select("user guild level");    
    let guild = client.guilds.cache.get(client.ayarlar.sunucuId);
     let göster = rankData.map(x => { return { Id: x.user, mLevel: x.level?.message?.level, }}).sort((a, b) => b?.level?.message?.level - a?.level?.message?.level).map((user, index) => `\`${index+1}.\` ${guild.members.cache.get(user.Id) ? guild.members.cache.get(user.Id) : "@deleted-user"}  \`Level Miktar: ${user.mLevel ? user.mLevel : "0"}\``).splice(0,20)
     let level = new MessageEmbed()
       .setColor("RANDOM")
       .setAuthor(`${client.ayarlar.tag} ${client.ayarlar.sunucuAdı}`,button.guild.iconURL({dynamic:true}))
       .setTimestamp()
       .setFooter(conf.footer)
       .setDescription(`**Level Tablosu**
       
       ${göster.join("\n")}`)
       await button.reply.think(true); 
       await button.reply.edit(level)
    }



  if (button.id === 'davet') {
    let guild = client.guilds.cache.get(client.ayarlar.sunucuId);
    let inviteData = await Database.find({});
      davetGoster = inviteData.map(user => {
          return {
            Id: user.userID,
            Total: user.bonus + user.regular,
            Regular: user.regular,
            Bonus: user.bonus,
            Fake: user.fake
          }
        }).sort((a,b) => b.Total - a.Total).map((data, index)=> `\`${index+1}.\` <@!${data.Id}> (\`Toplam: ${data.Total} Regular: ${data.Regular}\`)`).splice(0,25).join("\n")
       
        let davet = new MessageEmbed({
          color: "RANDOM",
          title: "Davet Tablosu",
          description: `${davetGoster}`,
          footer: { text: conf.footer },
          timestamp: Date.now()
        })

        await button.reply.think(true); 
        await button.reply.edit(davet)
   }
})
                                       
exports.conf = {
    aliases: [],
}

exports.help = {
    name: 'kısayol',
    description: "Sunucu istatistik bilgilerini gösterir.",
    usage: 'kısayol',
    kategori: "Bot Yapımcısı"
};