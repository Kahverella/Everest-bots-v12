const { MessageEmbed } = require("discord.js");
const discordbuttons = require('discord-buttons')
let sunucuayar = require("../../models/sunucuayar");
let TeamData = require('../../models/Team')
  module.exports.run = async (client, message, args, durum, kanal) => {
    
if(durum) {

    if (!message.guild) return;
    let sex = args[0];
    let TeamTag = args[1];
    let TeamTicket = args[2];
    let TeamRol = args[3];
           
    let data = await sunucuayar.findOne({
        guildID: message.guild.id
    });
   let EnAltYetkiliRol = data.EnAltYetkiliRol;
    let tag = data.TAG


    const db = await TeamData.find();

    if (sex === "oluştur") {
        if (!TeamTag) return message.channel.send(new MessageEmbed().setColor("RANDOM").setDescription(`Lütfen doğru şekilde ekip oluşturunuz. \n Örnek: !ekip oluştur Winner 1453`)).then(x => x.delete({ timeout: 4000 }));
        if (!TeamTicket|| isNaN(TeamTicket)) return message.channel.send(new MessageEmbed().setColor("RANDOM").setDescription(`Lütfen doğru şekilde ekip oluşturunuz. \n Örnek: !ekip oluştur Winner 1453`)).then(x => x.delete({ timeout: 4000 }));

if (TeamRol) {

    await TeamData.create({
        tag: TeamTag,
        ticket: `${TeamTicket}`,
        trole: TeamRol,
        created: Date.now()
    });

    await message.guild.members.cache.filter(m => m.user.username.toLowerCase().includes(TeamTag.toLowerCase)).forEach(async (x) => await x.roles.add(TeamRol));
    await message.guild.members.cache.filter(m => m.user.discriminator === `${TeamTicket}`).forEach(async (x) => await x.roles.add(TeamRol));

} else {
      const TeamRole = await message.guild.roles.create({
            data: {
                name: `${TeamTag} #${TeamTicket}`,
                hoist: false,
                permissions: 0,
                mentionable: false
            }
        })

        await TeamData.create({
            tag: TeamTag,
            ticket: `${TeamTicket}`,
            trole: TeamRole.id,
            created: Date.now()
        });
        await message.guild.members.cache.filter(m => m.user.username.toLowerCase().includes(TeamTag.toLowerCase)).forEach(async (x) => await x.roles.add(TeamRole.id));
        await message.guild.members.cache.filter(m => m.user.discriminator === `${TeamTicket}`).forEach(async (x) => await x.roles.add(TeamRole.id));

}

      
              await message.channel.send(`${TeamTag} #${TeamTicket} ekibi için her şeyi hazırladım!`)
        return; 
    }
   
      if (sex === "çıkar") {
        let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        if (!rol) return message.reply(`Çıkartılacak ekipin rol'ünü etiketleyiniz!`)
        const db = await TeamData.findOne({ trole: rol.id });
        if (!db) return
        await message.guild.roles.cache.get(db.trole).delete();
        await TeamData.deleteOne({ trole: rol.id }).exec();
        await message.channel.send(`Bir ekip aramızdan ayrıldı!`)
        return;
      }


      client.on('clickMenu', (menu) => {
        if (menu.id === 'teams' && !([].some(role => menu.clicker.member.roles.cache.has(role)) || menu.clicker.member.permissions.has(8))) return;
    
        const role = menu.guild.roles.cache.get(menu.values[0]);
        if (!role) return menu.reply.send('Belirtilen rol silinmiş veya rolü bulamıyorum.');
        const db = TeamData.findOne({ trole: role.id });
        menu.reply.send(
            new MessageEmbed()
                .setColor('RANDOM')
                .setThumbnail(menu.guild.iconURL({ dynamic: true }))
                .setDescription([
                    `**${role.name}** Ekip Bilgileri:\n`,
                    `Toplam Kullanıcı Sayısı: \`${role.members.size || "0"} kişi\``,
                    `Çevrimiçi Kullanıcı Sayısı: \`${role.members.filter(member => member.presence.status !== "offline").size || 0} kişi\``,
                    `Seste Olmayan Kullanıcı Sayısı: \`${role.members.filter(member => member.presence.status !== "offline" && !member.voice.channel).size || 0} kişi\``,
                    `Taglı Kullanıcı Sayısı: \`${role.members.filter(member => member.user.username.includes(tag)).size} kişi\``,
                    `Yetkili Kullanıcı Sayısı: \`${role.members.filter(member => member.roles.cache.get(EnAltYetkiliRol)).size} kişi\``

                ].join('\n')),
                {
                    buttons: [
                        new discordbuttons.MessageButton().setStyle('blurple').setLabel('Seste Olmayanlar').setID(`voice-${role.id}`),
                        new discordbuttons.MessageButton().setStyle('blurple').setLabel('Rol Dağıt').setID(`give-${role.id}`),
                        new discordbuttons.MessageButton().setStyle('blurple').setLabel('Ekip Üyeleri').setID(`members-${role.id}`)
                    ]
                }
        )
    });
    
    client.on('clickButton', async (button) => {
        if (button.id.startsWith('voice')) {
            const role = button.guild.roles.cache.get(button.id.split('-')[1]);
            if (!role) return menu.reply.send('Belirtilen rol silinmiş veya rolü bulamıyorum.');

    
            button.reply.send(`**${role.name}** rolüne sahip çevrimiçi ama seste olmayan üyeler;\n${role.members.filter(member => member.presence.status !== "offline" && !member.voice.channel).map(member => member.toString()) || "Kullanıcı Bulunamadı"}`);
        } else if (button.id.startsWith('give')) {
            const role = button.guild.roles.cache.get(button.id.split('-')[1]);
            let db = await TeamData.findOne({ trole: role.id });
            if (!role) return menu.reply.send('Belirtilen rol silinmiş veya rolü bulamıyorum.');
 
            
    
            const taggedMembers = button.guild.members.cache.filter(member => member.user.tag.toLowerCase().includes(db.tag) + member.user.discriminator.includes(db.ticket) && !member.roles.cache.has(role.id))             
    
            taggedMembers.map(member => member.roles.add(role.id));
    
            await button.reply.send(`**${role.name}** rolüne sahip olmayan taglı üyeler (\`${taggedMembers.size}\`)\n ${taggedMembers.map(x=> x) || "Üye Bulunamadı"}`);
        } else if (button.id.startsWith('members')) {
            const role = button.guild.roles.cache.get(button.id.split('-')[1]);
            if (!role) return menu.reply.send('Belirtilen rol silinmiş veya rolü bulamıyorum.');
    
            await button.reply.send(`**${role.name}** rolüne sahip üyeler; (\`${role.members.size}\`)`);
            button.channel.send(`${role.members.map(member => `${member.user.tag} (${member.id}) `)} `, { split: true, code: 'fix' } ||"Üye Bulunamadı");
        }
    })
    
    if (sex === "bak") {
        const teamsex = await TeamData.find();
        const menu = new discordbuttons.MessageMenu()
        .setID('teams')
        .setPlaceholder('Henüz bir ekip seçilmemiş.')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(teamsex.map(team => {
                const role = message.guild.roles.cache.get(team.trole);
                return new discordbuttons.MessageMenuOption().setValue(role ? role.id : "Rol Silinmiş").setEmoji(client.emojis.cache.find(x => x.name === "kck_stat").id).setLabel(role ? role.name : "Rol Silinmiş")
            })
        );
    await message.channel.send('Bilgisini görmek istediğiniz ekibin seçeneğine tıklayınız.', menu).then(x=> x.delete({timeout:15000}))
 return;
      }


      let gösterge = db.length > 0 ? db.map((veri, index) => {
        return {Mesaj: `**${message.guild.roles.cache.get(veri.trole) ? message.guild.roles.cache.get(veri.trole).name : "Rol Silinmiş"} ekip bilgileri**
**•** Toplam Kullanıcı Sayısı: \`${message.guild.roles.cache.get(veri.trole) ? message.guild.roles.cache.get(veri.trole).members.size : "0"} kişi\`
**•** Çevrimiçi Kullanıcı Sayısı: \`${message.guild.roles.cache.get(veri.trole) ? message.guild.roles.cache.get(veri.trole).members.filter(x => x.presence.status !== "offline").size : "0"} kişi\`
**•** Sesteki Kullanıcı Sayısı: \`${message.guild.roles.cache.get(veri.trole) ?message.guild.roles.cache.get(veri.trole).members.filter(x => x.voice.channel).size : "0"} kişi\`
**•** Seste Olmayan Kullanıcı Sayısı: \`${message.guild.roles.cache.get(veri.trole) ? message.guild.roles.cache.get(veri.trole).members.filter(x => !x.voice.channel && x.presence.status !== "offline").size : "0"} kişi\`
`

        }
    }).map(x => `${x.Mesaj}`).join("") : "Veri yoktur.";

 message.channel.send(new MessageEmbed() .setThumbnail(message.guild.iconURL({ dynamic: true })) .setTimestamp().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setFooter(client.ayarlar.footer).setColor("RANDOM").setDescription(`Aşağıdaki ekip verilerini daha detaylı bir şekilde görmek için \`.ekip bak\` yazınız. 

 ${gösterge}`))
}
    };
exports.conf = {
    aliases: ["Ekip"]
}
exports.help = {
    name: 'ekip',
    description: "Sunucudaki ekipleri kontrol eder.",
    usage: 'ekip',
    kategori: "Yönetici Komutu"
  };