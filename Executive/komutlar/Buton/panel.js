const disbut = require("discord-buttons");
const { MessageEmbed } = require("discord.js");
const conf = client.ayarlar;
let moment = require("moment")
moment.locale("tr");
let ms = require("ms");
let sunucuayar = require("../../models/sunucuayar");
let ceza = require("../../models/ceza");
let profil = require("../../models/profil");
let jailInterval = require("../../models/jailInterval");
var limit = new Map(); 

const reasons = [
  'Sunucunun düzenini bozucak "Hal ve davranış"',
  'Din / Irkçılık / Siyaset',
  'Tehdit / Şantaj / İftira atmak / Taciz'
];

module.exports.run = async (client, message, args, durum, kanal) => {
  if (!message.member.permissions.has(8) && !client.ayarlar.sahip.includes(message.author.id)) return;

  let data = sunucuayar.findOne({})
  let JailSorumlusu = data.JAILAuthorized;
  let JailLogKanal = "937471413273624656";
  let JailLimit = data.JAILLimit;
  let booster = data.BOOST;

  let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!target) return message.reply("Lütfen bir kullanıcı etiketleyiniz.");

  if (limit.get(message.author.id) >= JailLimit) return message.reply(`\`Ceza komutu için limite ulaştın!\``);
  if (target.roles.cache.get(data.EnAltYetkiliRol) && !message.member.permissions.has(8)) return message.reply("Yetkililer birbirine ceza-i işlem uygulayamazlar.");
  if (message.member.roles.highest.position <= target.roles.highest.position) return client.Embed(message.channel.id, `Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)
  if (target.id === message.author.id) return;
  limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) + 1)
  setTimeout(() => { limit.set(`${message.author.id}`, (Number(limit.get(`${message.author.id}`) || 0)) - 1) },1000 * 60 * 3)
  let cezalar = await ceza.find({ userID: target.id });
  if (cezalar.length == 0) { cezalar = [ {Puan: 0 }, { Puan: 0 }]; };


  const menuComponent = new disbut.MessageMenu()
  .addOptions(reasons.map((reason, index) => ({ label: reason, value: `${index}` })))
  .setID("menu");

  const question = await message.channel.send({ content: `${target.toString()} (\`${target.id}\`) adlı kullanıcıya hangi sebebden ötürü ceza verilecek seçiniz!`, component: menuComponent });
  const collector = await question.createMenuCollector((inf) => inf.clicker.user.id === message.author.id, { time: 30000 });
  
  collector.on('collect', async (inf) => {
    await inf.reply.defer();
    const reason = reasons[inf.values[0]];
    const cezaID = data.WARNID;
    const JailROL = data.JAIL;
    await client.toplama(cezalar,client.ayarlar.CEZA_PUAN_KANAL, target.id, cezaID, 15);
    await banSistemi(message, client, JailLogKanal, target, cezaID, JailROL, booster,reason);
  });
}
exports.conf = {
  aliases: []
}
exports.help = {
  name: 'x',
  description: "Suncudaki üyelere rol dağıtımı sağlar.",
  usage: 'x', 
};
async function banSistemi(message, client, JailLogKanal, target, cezaID, JailROL, booster,reason) {

  let messageEmbed = `${target} Üyesi Sunucudan **${reason}** sebebiyle ${message.author} Tarafından ceza yedi! **Ceza Numarası:** (\`#${cezaID+1}\`)`;
  let messageLogEmbed = new MessageEmbed().setColor("RANDOM").setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
      .setFooter(conf.footer)
      .setTimestamp()
      .setDescription(`
• Ceza ID: \`#${cezaID+1}\`
• Cezalanan Üye: ${target.toString()} (\`${target.id}\`)
• Cezalayan Yetkili: ${message.author} (\`${message.author.id}\`)
• Ceza Tarihi: \`${moment(Date.now()).format('LLL')}\`
• Ceza Bitiş Tarihi: \`${moment(Date.now() + ms("1d")).format('LLL')}\`
• Ceza Sebebi: [\`${reason}\`]
`);
  await target.roles.set(target.roles.cache.get(booster) ? [JailROL, booster] : [JailROL]).then(async () => {
if (target.voice.channel) {
  target.voice.setChannel(null);
}
      await message.channel.send(messageEmbed);
      await client.channels.cache.get(JailLogKanal).send(messageLogEmbed);
          let newData = ceza({
              ID: cezaID + 1,
              userID: target.id,
              Yetkili: message.author.id,
              Ceza: "JAIL",
              Sebep: reason,
              Puan: 15,
              Atilma: Date.now(),
              Bitis: Date.now() + ms("1d"),
          });
          await profil.updateOne({userID: message.author.id, guildID: message.guild.id}, {$inc: {JailAmount: 1}}, {upsert: true}).exec();
          await client.savePunishment();
          await newData.save();

          await jailInterval.findOne({userID: target.id}, (err,data) => {
              if (!data) {
                  newData = new jailInterval({
                      userID: target.id,
                      jailed: true,
                  })
                  newData.save()
              } else {
                  data.jailed = true,data.save();
              }
          })
  });
};