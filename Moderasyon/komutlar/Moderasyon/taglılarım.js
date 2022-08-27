let sunucuayar = require("../../models/sunucuayar");
let taglıData = require("../../models/taglilarim");
let moment = require("moment")
moment.locale("tr");
let table = require("string-table");
module.exports.run = async (client, message, args, durum, kanal) => {

    let mentioned = message.member.id;
    let setup = await sunucuayar.findOne({})
    let tagi = setup.TAG;
    let data = await taglıData.find({ authorID: mentioned })

    let control = await taglıData.findOne({ authorID: mentioned })
    if (!control) return message.reply(`Herhangi bir taglı veriniz bulunmamaktadır!`);
    
    let vericik = [];

      data.map(x => {   
        
        if (message.guild.members.cache.get(x.userID)) {
          let next = message.guild.members.cache.get(x.userID).user.username.includes(tagi) ? "Taglı" : "Tagsız" 

    vericik.push({
              "ID": x.userID,
              "Üye": `${message.guild.members.cache.get(x.userID) ? message.guild.members.cache.get(x.userID).displayName : "Bulunamadı"}`,
              "Tarih": `${moment(x.Tarih).format('LLL')}`,
              "Durum": `${next}`,
                 })
        } else {
    vericik.push({
            "ID": x.userID,
            "Üye": `${message.guild.members.cache.get(x.userID) ? message.guild.members.cache.get(x.userID).displayName : "Sunucuda Yok"}`,
            "Tarih": `${moment(x.Tarih).format('LLL')}`,
            "Durum": `Sunucuda Yok`,
          })
        }
      });

      const sex = table.create(vericik, { headers: ["ID", "Üye", "Tarih", "Durum"] });

      message.channel.send(sex , { code: "fix", split: true }).catch(x => message.channel.send(x))
}
exports.conf = {
    aliases: ["Taglılarım"]
}
exports.help = {
    name: 'taglılarım'
}