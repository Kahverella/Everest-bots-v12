const disbut = require("discord-buttons");
let haftalıkMission = require("../../models/haftalıkMission");

let ms = require("ms");
let moment = require("moment");
module.exports.run = async (client, message, args, durum, kanal) => {
    if (!client.ayarlar.sahip.some(x => x == message.author.id)) return;

let tag = new disbut.MessageButton().setStyle('red').setLabel('Tag Görevi!').setID('tag')
let ses = new disbut.MessageButton().setStyle('red').setLabel('Ses Görevi!').setID('ses')
let chat = new disbut.MessageButton().setStyle('red').setLabel('Chat Görevi!').setID('chat')
let yetkili = new disbut.MessageButton().setStyle('red').setLabel('Yetkili Görevi!').setID('yetkili')
let invite = new disbut.MessageButton().setStyle('red').setLabel('İnvite Görevi!').setID('invite')

message.channel.send(`Aşığadaki butonlara tıklayarak **haftalık** görevlerini alabilir ve rol yükseltimine katkı sağlayabilirsin!`

, { buttons: [tag,ses,chat,yetkili,invite] })


client.on('clickButton', async (button) => {
    if (button.id === 'chat') {
        await button.reply.think(true);
        await button.reply.edit("Mesaj göreviniz eklendi!! .görevlerim komutunu kullanarak takibini sağlayabilirsiniz.")
        haftalıkMission.updateOne({ userID: button.clicker.member.id }, {
            $set: {
                userID: button.clicker.member.id,
                Check: 0,
                Mission: {
                    Type: "mesaj",
                    Amount: "10"
                },
                Time: Number(Date.now() + ms("1m"))
            }
        }, { upsert: true }).exec();
        client.channels.cache.get("960407088427851836").send(`görev verildi`);
       
    }

    if (button.id === 'ses') {
        await button.reply.think(true);
        await button.reply.edit("Ses göreviniz eklendi!! .görevlerim komutunu kullanarak takibini sağlayabilirsiniz.")
        haftalıkMission.updateOne({ userID: button.clicker.member.id }, {
            $set: {
                userID: button.clicker.member.id,
                Check: 0,
                Mission: {
                    Type: "ses",
                    Amount: Number((1000 * 60 *1))
                },
                Time: Number(Date.now() + ms("1m"))
            }
        }, { upsert: true }).exec();
        client.channels.cache.get("960407088427851836").send(`görev verildi`);
       
    }
  });
}

exports.conf = {
    aliases: []
}
exports.help = {
    name: 'göreval',
    description: "Görev alımını sağlar.",
    usage: 'buton',
    kategori: "Bot Yapımcısı"
};