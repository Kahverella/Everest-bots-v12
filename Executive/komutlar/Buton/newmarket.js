const disbut = require("discord-buttons");
const { MessageEmbed } = require("discord.js");
let conf = client.ayarlar;
const moment = require("moment");
let table = require("string-table");

module.exports.run = async (client, message, args, durum, kanal) => {
    if (message.member.permissions.has(8) || !client.ayarlar.sahip.some(x => x == message.author.id)) {

      let marketopsiyonel = new disbut.MessageMenuOption().setValue("marketopsiyonel").setLabel("Opsiyonel Market!").setEmoji(client.emojis.cache.find(x => x.name === "jp_coin").id)
      let marketizleyici = new disbut.MessageMenuOption().setValue("marketizleyici").setLabel("İzleyici Market!").setEmoji(client.emojis.cache.find(x => x.name === "jp_coin").id)
      let marketdinleyici = new disbut.MessageMenuOption().setValue("marketdinleyici").setLabel("Dinleyici Market!").setEmoji(client.emojis.cache.find(x => x.name === "jp_coin").id)
  
      const menu = new disbut.MessageMenu()
  .setID('menu')
  .setPlaceholder('Lüfen bir market seçiniz!.')
  .setMaxValues(1)
  .setMinValues(1)
  .addOptions(marketopsiyonel,marketizleyici,marketdinleyici)
    let menusex = await message.channel.send('**⟡ Mirage** Market Sistemi Aşağıda Bulunan Menülerden Market Türünü Belirtiniz!', menu)

    let xnitro = new disbut.MessageButton().setStyle('green').setLabel('Nitro').setID('xnitro').setEmoji(client.emojis.cache.find(x => x.name === "nitro").id)
    let xcnitro = new disbut.MessageButton().setStyle('green').setLabel('Classic Nitro').setID('cxnitro').setEmoji(client.emojis.cache.find(x => x.name === "nitro").id)
    let xyoutube = new disbut.MessageButton().setStyle('green').setLabel('Youtube Premium').setID('xyoutube').setEmoji(client.emojis.cache.find(x => x.name === "youtube").id)
    let xnetflix = new disbut.MessageButton().setStyle('green').setLabel('Netflix').setID('xnetflix').setEmoji(client.emojis.cache.find(x => x.name === "netflix2").id)        
    let xblutv = new disbut.MessageButton().setStyle('green').setLabel('Blu TV').setID('xblutv').setEmoji(client.emojis.cache.find(x => x.name === "blutv").id)
    let xexxen = new disbut.MessageButton().setStyle('green').setLabel('Exxen').setID('xexxen').setEmoji(client.emojis.cache.find(x => x.name === "exxen").id)
    let xspotify = new disbut.MessageButton().setStyle('green').setLabel('Spotify Premium').setID('xspotify').setEmoji(client.emojis.cache.find(x => x.name === "spotify").id)
    let xdeezer = new disbut.MessageButton().setStyle('green').setLabel('Deezer Premium').setID('xdeezer').setEmoji(client.emojis.cache.find(x => x.name === "spotify").id)
    let xyoutubepre = new disbut.MessageButton().setStyle('green').setLabel('Youtube Music').setID('xyoutubepre').setEmoji(client.emojis.cache.find(x => x.name === "youtube").id)

    let xred = new disbut.MessageButton().setStyle('red').setLabel('Kapat').setID('xred')
    
    const izleyicip = new disbut.MessageActionRow().addComponents([ xyoutube, xnetflix, xblutv, xexxen ]);
    const dinleyicip = new disbut.MessageActionRow().addComponents([ xspotify, xdeezer, xyoutubepre ]);
    const opsiyonelp = new disbut.MessageActionRow().addComponents([ xnitro, xcnitro, xyoutubepre ]);


let opsiyonel = [];
let opsiyonelmarket = [
    { ID: "1", NAME: "Nitro", PRODUCT: "1 Ay", PRICE: "x"},
    { ID: "2", NAME: "Classic Nitro", PRODUCT: "1 Ay", PRICE: "x"},
    { ID: "3", NAME: "250k Owo Parası", PRODUCT: "1 Ay", PRICE: "x"}
]
opsiyonelmarket.map(value => { 
  opsiyonel.push({ "ID": `#${value.ID}`, "Ürün İsmi": `${value.NAME}`, "Ürün Detayı": `${value.PRODUCT}`,"Ürün Fiyatı": `${value.PRICE}`})
})
let dinleyici = [];
let dinleyiciimarket = [
    { ID: "1", NAME: "Spotify Premium", PRODUCT: "1 Ay", PRICE: "x"},
    { ID: "2", NAME: "Deezer", PRODUCT: "1 Ay", PRICE: "x"},
    { ID: "3", NAME: "Youtube Music", PRODUCT: "1 Ay", PRICE: "x"}
]
dinleyiciimarket.map(value => { 
    dinleyici.push({ "ID": `#${value.ID}`, "Ürün İsmi": `${value.NAME}`, "Ürün Detayı": `${value.PRODUCT}`, "Ürün Fiyatı": `${value.PRICE}`})
})
let izleyici = [];
let izleyicimarket = [
    { ID: "1", NAME: "Youtube Premium", PRODUCT: "1 Ay", PRICE: "x"},
    { ID: "2", NAME: "Netflix", PRODUCT: "1 Ay", PRICE: "x"},
    { ID: "3", NAME: "Blu TV", PRODUCT: "1 Ay", PRICE: "x"},
    { ID: "4", NAME: "Exxen", PRODUCT: "1 Ay", PRICE: "x"}
]
izleyicimarket.map(value => { 
  izleyici.push({ "ID": `#${value.ID}`, "Ürün İsmi": `${value.NAME}`, "Ürün Detayı": `${value.PRODUCT}`,"Ürün Fiyatı": `${value.PRICE}`})
})

const opsiyoneltable = table.create(opsiyonel, { headers: ["ID", "Ürün İsmi", "Ürün Detayı" ,"Ürün Fiyatı"] });
const izleyicitable = table.create(izleyici, { headers: ["ID", "Ürün İsmi", "Ürün Detayı" ,"Ürün Fiyatı"] });
const dinleyicitable = table.create(dinleyici, { headers: ["ID", "Ürün İsmi", "Ürün Detayı" ,"Ürün Fiyatı"] });

let izleyiciembed = new MessageEmbed()
.setColor("RANDOM")
.setDescription(`**⟡ Mirage** mağazasına hoş geldin ${message.member}, Burada kendine çeşitli ödüller satın alabilirsin!`)
.addField(`⟡ Mirage Mağaza     |   Mevcut Bakiyeniz: (31 Coin)`,`\`\`\`fix\n${izleyicitable}\`\`\``)
.addField(`⟡ Nasıl ürün alabilirim?`,`Aşağıda beliren butonlardan yeşil olanlara \`45 Saniye\` içerisinde tıklayarak satın alabilirsin`)
let opsiyonelembed = new MessageEmbed()
.setColor("RANDOM")
.setDescription(`**⟡ Mirage** mağazasına hoş geldin ${message.member}, Burada kendine çeşitli ödüller satın alabilirsin!`)
.addField(`⟡ Mirage Mağaza     |   Mevcut Bakiyeniz: (31 Coin)`,`\`\`\`fix\n${opsiyoneltable}\`\`\``)
.addField(`⟡ Nasıl ürün alabilirim?`,`Aşağıda beliren butonlardan yeşil olanlara \`45 Saniye\` içerisinde tıklayarak satın alabilirsin`)

let dinleyiciembed = new MessageEmbed()
.setColor("RANDOM")
.setDescription(`**⟡ Mirage** mağazasına hoş geldin ${message.member}, Burada kendine çeşitli ödüller satın alabilirsin!`)
.addField(`⟡ Mirage Mağaza     |   Mevcut Bakiyeniz: (31 Coin)`,`\`\`\`fix\n${dinleyicitable}\`\`\``)
.addField(`⟡ Nasıl ürün alabilirim?`,`Aşağıda beliren butonlardan yeşil olanlara \`45 Saniye\` içerisinde tıklayarak satın alabilirsin`)


client.on("clickMenu", async (menu)  => {
  if (menu.values.includes("marketopsiyonel")) {
    await menusex.delete()
  await menu.reply.send(opsiyonelembed,{ components: [ opsiyonelp ] })
  }
  if (menu.values.includes("marketizleyici")) {
    await menusex.delete()
   await menu.reply.send(izleyiciembed,{ components: [ izleyicip ] })
  }
  if (menu.values.includes("marketdinleyici")) {
    await menusex.delete()
   await menu.reply.send(dinleyiciembed,{ components: [ dinleyicip ] })
  }
})

}
}
exports.conf = {
    aliases: []
}
exports.help = {
    name: 'nm',
    description: "Suncudaki üyelere rol dağıtımı sağlar.",
    usage: 'nm',
    kategori: "Yönetici Komutları"
  };