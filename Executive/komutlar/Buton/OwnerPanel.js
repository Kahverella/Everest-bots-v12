const disbut = require("discord-buttons");

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

1 -> Yetkileri kapat.
2 -> Statları sıfırla.
3 -> Toplantı çağır.

4 -> Tüm banları kaldır.
5 -> Tüm sicilleri temizle.
6 -> Son 24 saat içerisinde yapılan ceza'i işlemler.

7 -> Tagsızları kontrol et.
8 -> Rolsüzleri kontrol et.
9 -> Kanal izinlerini yükle.

10 -> Alt yönetim görevlerini sıfırla.
11 -> Orta yönetim görevlerini sıfırla.
12 -> Üst yönetim görevlerini sıfırla.
`, { components:[ panel,panel2,panel3,panel4,panel5 ] })

}

client.on('clickButton', async (button) => {
    if (button.id === 'etkinlik') {
    }
    if (button.id === 'cekilis') {

    }
     
  });
exports.conf = {
    aliases: []
}
exports.help = {
    name: 'yonetimpanel',
    description: "Sunucudaki etkinlik rolleri için sistem kurar.",
    usage: 'yonetimpanel',
    kategori: "Bot Yapımcısı"
  };