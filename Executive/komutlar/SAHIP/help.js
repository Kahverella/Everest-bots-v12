const { MessageEmbed } = require("discord.js");
const disbut = require("discord-buttons");
let ozelKomut = require("../../models/özelkomut");

exports.run = async (client, message, args, durum, kanal) => {
  let data = await ozelKomut.find({ guildID: message.guild.id }) || [];

   let komutlar = client.commands.filter(x=> x.help.usage && x.help.kategori && x.help.kategori === "Bot Yapımcısı").map(x=> `\`${client.ayarlar.prefix[0]}${x.help.name} ${x.help.usage}\``).join("\n")
   let komutlar2 = client.commands.filter(x=> x.help.usage && x.help.kategori && x.help.kategori === "Yönetici Komutları").map(x=> `\`${client.ayarlar.prefix[0]}${x.help.name} ${x.help.usage}\``).join("\n")
   let komutlar3 = client.commands.filter(x=> x.help.usage && x.help.kategori && x.help.kategori === "Yetkili Komutları").map(x=> `\`${client.ayarlar.prefix[0]}${x.help.name} ${x.help.usage}\``).join("\n")
   let komutlar4 = client.commands.filter(x=> x.help.usage && x.help.kategori && x.help.kategori === "Stat Komutları").map(x=> `\`${client.ayarlar.prefix[0]}${x.help.name} ${x.help.usage}\``).join("\n")
   let komutlar5 = client.commands.filter(x=> x.help.usage && x.help.kategori && x.help.kategori === "Yönetim Komutları").map(x=> `\`${client.ayarlar.prefix[0]}${x.help.name} ${x.help.usage}\``).join("\n")

   let özelkomutlar = data.length > 0 ? data.map(x => `\`${client.ayarlar.prefix[0]}${x.komutAd} @etiket\``).join("\n"): "Özel Komut Yoktur."
   
let embed = new MessageEmbed({
  color: "RANDOM",
  author: "Bot Yapımcısı",
  description: `${komutlar}`
})

let AdminEmbed = new MessageEmbed({
  color: "RANDOM",
  author: "Yönetici/Yönetim Komutları",
  description: `${komutlar2}
  ${komutlar5}
  \`${client.ayarlar.prefix[0]}kayıtsız @etiket\`
  \`${client.ayarlar.prefix[0]}say\`
  \`${client.ayarlar.prefix[0]}sesli\``
})

let AuthEmbed = new MessageEmbed({
  color: "RANDOM",
  author: "Yetkili Komutları",
  description: `${komutlar3}
  \`${client.ayarlar.prefix[0]}taglı @etiket\``
})

let StatEmbed = new MessageEmbed().setColor("RANDOM").addField("Moderasyon Komutları",`

\`${client.ayarlar.prefix[0]}underworld @etiket [süre]\`
\`${client.ayarlar.prefix[0]}banbilgi [userID]\`
\`${client.ayarlar.prefix[0]}ceza-bilgi @etiket / [userID]\`
\`${client.ayarlar.prefix[0]}cezaID [ID]\`
\`${client.ayarlar.prefix[0]}cezalar @etiket / [userID]\`
\`${client.ayarlar.prefix[0]}dc-cezalı @etiket [süre] [sebep]\`
\`${client.ayarlar.prefix[0]}mute @etiket [süre] [sebep]\`
\`${client.ayarlar.prefix[0]}reklam @etiket\`
\`${client.ayarlar.prefix[0]}jail @etiket [süre] [sebep]\`
`,true)
.addField("Stat Komutları",`
${komutlar4}
\`${client.ayarlar.prefix[0]}level @etiket\`
\`${client.ayarlar.prefix[0]}stat @etiket\`
\`${client.ayarlar.prefix[0]}ses-bilgi @etiket\`
\`${client.ayarlar.prefix[0]}top\``,true)

let GeneralEmbed = new MessageEmbed({
  color: "RANDOM",
  author: "Genel Komutlar",
  description: `
  \`${client.ayarlar.prefix[0]}tag\`
  \`${client.ayarlar.prefix[0]}link\`
  \`${client.ayarlar.prefix[0]}afk [sebep]\`
  \`${client.ayarlar.prefix[0]}alarm [süre/sebep]\`
  \`${client.ayarlar.prefix[0]}bilgi @etiket\`
  \`${client.ayarlar.prefix[0]}booster [nickname]\`
  \`${client.ayarlar.prefix[0]}izinliçek @etiket\`
  \`${client.ayarlar.prefix[0]}izinligit @etiket\``
})


let SpecEmbed = new MessageEmbed({
  color: "RANDOM",
  author: "Özel Komutlar",
  description: `${özelkomutlar}`
})

   const adminhelp =  new disbut.MessageMenuOption().setValue("adminhelp").setLabel("Yönetici Komutları");
   const authhelp =  new disbut.MessageMenuOption().setValue("authhelp").setLabel("Yetkili Komutları");
   const stathelp =  new disbut.MessageMenuOption().setValue("stathelp").setLabel("Moderasyon/Stat Komutları");
   const genel =  new disbut.MessageMenuOption().setValue("genel").setLabel("Genel Komutlar");

   const speccommand =  new disbut.MessageMenuOption().setValue("speccommand").setLabel("Özel Komutlar");

   const helpx = new disbut.MessageMenu()
   .setID('menu')
   .setPlaceholder('Lütfen bir yardım kategorisi seçiniz!')
   .setMaxValues(1)
   .setMinValues(1)
   .addOptions(adminhelp,authhelp,stathelp,genel,speccommand)
message.channel.send(`**${message.guild.name}**, sunucusunun bot komutlarını görüntülemek için menüden seçim yapabilirsiniz!`,helpx);

   client.on("clickMenu", async (menu) => {
       if (menu.values.includes("adminhelp")) {
        await menu.reply.think(true)
        menu.reply.edit(AdminEmbed);
    }

    if (menu.values.includes("authhelp")) {
      await menu.reply.think(true)
       menu.reply.edit(AuthEmbed);
  }
  
  if (menu.values.includes("stathelp")) {
    await menu.reply.think(true)
     menu.reply.edit(StatEmbed);
}
if (menu.values.includes("genel")) {
  await menu.reply.think(true)
   menu.reply.edit(GeneralEmbed);
}
  if (menu.values.includes("speccommand")) {
    await menu.reply.think(true)
     menu.reply.edit(SpecEmbed);
}
   })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['yardım']
};

exports.help = {
  name: 'help',
  description: "Sunucuda komut denemeye yarar",
  usage: 'eval <kod>',
  kategori: "Bot Yapımcısı"
};