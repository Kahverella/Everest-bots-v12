const disbut = require("discord-buttons");
const { MessageEmbed } = require("discord.js");
let moment = require("moment")
moment.locale("tr");
const Stat = require("../../models/stats");
let teyit = require("../../models/teyit");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!client.ayarlar.sahip.some(x => x == message.author.id)) return;

let bir = new disbut.MessageButton().setStyle('blurple').setLabel('1').setID('bir')
let iki = new disbut.MessageButton().setStyle('blurple').setLabel('2').setID('iki')
let uc = new disbut.MessageButton().setStyle('blurple').setLabel('3').setID('uc')
let dort = new disbut.MessageButton().setStyle('blurple').setLabel('4').setID('dort')
let bes = new disbut.MessageButton().setStyle('blurple').setLabel('5').setID('bes')
let alti = new disbut.MessageButton().setStyle('blurple').setLabel('6').setID('alti')
let yedi = new disbut.MessageButton().setStyle('blurple').setLabel('7').setID('yedi')
let sekiz = new disbut.MessageButton().setStyle('blurple').setLabel('8').setID('sekiz')
let dokuz = new disbut.MessageButton().setStyle('blurple').setLabel('9').setID('dokuz')
let on = new disbut.MessageButton().setStyle('blurple').setLabel('10').setID('on')
let onbir = new disbut.MessageButton().setStyle('blurple').setLabel('11').setID('onbir')
let oniki = new disbut.MessageButton().setStyle('blurple').setLabel('12').setID('oniki')
let onuc = new disbut.MessageButton().setStyle('blurple').setLabel('13').setID('onuc')
let ondort = new disbut.MessageButton().setStyle('blurple').setLabel('14').setID('ondort')
let onbes = new disbut.MessageButton().setStyle('blurple').setLabel('15').setID('onbes')


let panel = new disbut.MessageActionRow()
.addComponents(bir,iki,uc)
let panel2 = new disbut.MessageActionRow()
.addComponents(dort,bes,alti)
let panel3 = new disbut.MessageActionRow()
.addComponents(yedi,sekiz,dokuz)
let panel4 = new disbut.MessageActionRow()
.addComponents(on,onbir,oniki)
let panel5 = new disbut.MessageActionRow()
.addComponents(onuc,ondort,onbes)
message.channel.send(`**⟡ Mirage** yönetim paneli; 

1 -> Sunucuya katılma tarihinizi öğrenin.
2 -> Veri tabanındaki eski isimlerinizi görüntüleyin.
3 -> Devam eden cezalarınızdan 10 tanesini (varsa) görüntüleyin.

4 -> Ceza durumuzunuzu görüntüleyin.
5 -> Kim tarafından davet edildiğinizi görüntüleyin.
6 -> Sahip olduğunuzu rolleri görüntüleyin.

7 -> Sunucudaki mesaj sayınızı görüntüleyin..
8 -> Sunucu sesli sohbetlerinde geçmiş olduğunuzu süreyi görüntüleyin.
9 -> Hesabınızın oluşturulma tarihini görüntüleyin.

10 -> Alt yönetim görevlerini sıfırla.
11 -> Sunucunun istatistiklerini görüntüleyin.
12 -> Kaydınızı temizleyin ve tekrar teyit verin..
`, { components:[ panel,panel2,panel3,panel4,panel5 ] })

}

client.on('clickButton', async (button) => {
    if (button.id === 'bir') {
      await button.reply.think(true)
      await button.reply.edit(`Sunucuya Katılma Tarihiniz: \`${moment(button.clicker.member.joinedAt).format('LLL')}\``)
    }
    if (button.id === 'iki') {
      let teyitData = await teyit.findOne({ userID: button.clicker.id }) || { userName: [] };
      
      let embed = new MessageEmbed()
          .setAuthor(button.clicker.displayName, button.clicker.user.displayAvatarURL({ dynamic: true }))
          .setColor("RANDOM")
          .setDescription(`${teyitData.userName.length <= 0 ? `İsim Geçmişin Bulunamadı.` : `${button.clicker} toplamda ${teyitData.userName.length} isim kayıtın bulundu.`} ${teyitData.userName.reverse().splice(0, 10).join("\n")}`)
        await button.reply.think(true)
        await button.reply.send(embed)
    }
    if (button.id === 'uc') {
    }
    if (button.id === 'dort') {
    }
    if (button.id === 'bes') {
    }
    if (button.id === 'alti') {
      await button.reply.think(true)
      await button.reply.edit(`Üzerinde Bulunan Rollerin Listesi ;
              
      ${(button.clicker.member.roles.cache.filter(a => a.name !== '@everyone').map(a => a).join(' ') ? button.clicker.member.roles.cache.filter(a => a.name !== '@everyone').map(a => a).join(', ') : 'Rolün yok.')}`)
      }
    if (button.id === 'yedi') {
      let MessageSize = Stat.findOne({ userID: button.clicker.id })
      await button.reply.think(true)
      await button.reply.edit(`Sunucuda toplam \`${MessageSize.totalMessage}\` mesajınız var`)
    }
    if (button.id === 'sekiz') {
    }
    if (button.id === 'dokuz') {
      await button.reply.think(true)
      await button.reply.edit(`Hesabınızın Açılış Tarihi: \`${moment(button.clicker.member.user.createdAt).format("LLL")}\``)
    }
  });
exports.conf = {
    aliases: []
}
exports.help = {
    name: 'kullanıcıpanel',
    description: "Sunucudaki etkinlik rolleri için sistem kurar.",
    usage: 'kullanıcıpanel',
    kategori: "Bot Yapımcısı"
  };