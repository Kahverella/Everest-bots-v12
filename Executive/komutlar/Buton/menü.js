const {
    MessageEmbed,
    Client,
    Message
  } = require("discord.js");
  const Discord = require('discord.js');
  const disbut = require("discord-buttons");
  const client = global.client;
  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   * @param {Boolean} durum 
   * @param {Boolean} kanal 
   * @returns
   */
  
  const burclar = {
    "♈": "929081639110340680",
    "♉": "929081719078920192",
    "♊": "929081211031273502",
    "♋": "929081231109410886",
    "♌": "929081305541521408",
    "♍": "929081401595277332",
    "♎": "929081250990407770",
    "♏": "929081186721091594",
    "♐": "929081469891137567",
    "♑": "929081284892979230",
    "♒": "929081324352979044",
    "♓": "929081267859898439"
    
  };
  
  const renkler = {
    "🥝": "895770783845056523",
    "🍒": "895770746431868928",
    "🍍": "895770872281976833",
    "🍇": "895770793923985449",
    "🥕": "895770789746466846"
    };

    const etkinlikler = {
      "938763446428790825": "894954877397106755", 
      "938763446760124436": "894954877388722215",  
      "938763446579757126": "894954877388722214" 
    }

  
  const digerler = {
    "💕": "894954877376163892",
    "💔": "894954877376163894"
  }; // iliski 
// senin ananı sikerim köfte bağırma mal amk 
  const oyunlar = {
    "938763446860795956":"931313776869904384", 
    "938763446613319731":"929077825175163010", 
    "938763446911135785":"931313908021612635", 
    "938763446932107304":"931314205972373514", 
    "938763446999187516":"931314334909476944" 
  };
  exports.run = async (client, message, args, durum, kanal) => {
    if (!message.guild) return;
    let guild = message.guild;
    if (!client.ayarlar.sahip.some(x => x === message.author.id)) return
  
    const burcPush = [];
    const oyunPush = [];
    const renkPush = [];
    const digerPush = [];
    const etkinlikPush = [];
    const emoji = (name) => client.emojis.cache.find(x => x.name === name);
  
  
    for (const burc in burclar) {
      let sonuc = burclar[burc];
      let table = new disbut.MessageMenuOption()
      .setLabel(message.guild.roles.cache.get(sonuc) ? message.guild.roles.cache.get(sonuc).name : sonuc)
      .setEmoji(emoji(burc) ? emoji(burc).id : burc)
        .setValue(sonuc)
   burcPush.push(table);
    };
    let kaldırburc = new disbut.MessageMenuOption()
    .setLabel("Kaldır")
    .setEmoji("888881676703399986")
    .setValue("kaldır")
    let burc = new disbut.MessageMenu()
      burc.setID("burc")
      burc.setPlaceholder(`Burç rollerini seçmek için tıkla!`)
      burc.setMaxValues(1)
      burc.setMinValues(1)
      burc.addOptions(burcPush,kaldırburc)
  

      for (const etkinlik in etkinlikler) {
        let sonuc = etkinlikler[etkinlik];
        let table = new disbut.MessageMenuOption()
        .setLabel(message.guild.roles.cache.get(sonuc) ? message.guild.roles.cache.get(sonuc).name : sonuc)
        .setEmoji(emoji(etkinlik) ? emoji(etkinlik).id : etkinlik)
          .setValue(sonuc)
          etkinlikPush.push(table);
      };
      let kaldıretkinlik = new disbut.MessageMenuOption()
      .setLabel("Kaldır")
      .setEmoji("888881676703399986")
      .setValue("kaldır")
      let etkinlik = new disbut.MessageMenu()
      etkinlik.setID("etkinlik")
        etkinlik.setPlaceholder(`Etkinlik rollerini seçmek için tıkla!`)
        etkinlik.setMaxValues(3)
        etkinlik.addOptions(etkinlikPush,kaldıretkinlik)
    


    for (const oyun in oyunlar) {
      const sonuc = oyunlar[oyun];
      let table = new disbut.MessageMenuOption()
      .setLabel(message.guild.roles.cache.get(sonuc)?.name)
      .setEmoji(emoji(oyun) ? emoji(oyun).id : oyun)
        .setValue(sonuc)
        .setDescription(`${message.guild.roles.cache.get(sonuc)?.name} rolüne sahip olmak için tıkla!`)
      oyunPush.push(table);
    };
    let kaldıroyun = new disbut.MessageMenuOption()
    .setLabel("Kaldır")
    .setEmoji("888881676703399986")
    .setValue("kaldır")
    let oyun = new disbut.MessageMenu();
    oyun.setID("oyun");
    oyun.setPlaceholder(`Oyun rollerini seçmek için tıkla!`);
    oyun.setMaxValues(5);
    oyun.setMinValues(1);
    oyun.addOptions(oyunPush,kaldıroyun);
  
 for (const renk in renkler) {
      const sonuc = renkler[renk];
      let table = new disbut.MessageMenuOption()
        .setLabel(`Rengine sahip olmak için tıkla!`)
        .setEmoji(emoji(renk) ? emoji(renk).id : renk)
        .setValue(sonuc)
      renkPush.push(table);
    };
    let kaldırrenk = new disbut.MessageMenuOption()
    .setLabel("Kaldır")
    .setEmoji("888881676703399986")
    .setValue("kaldır")
    let renk = new disbut.MessageMenu();
    renk.setID("renk");
    renk.setPlaceholder(`Renk rollerini seçmek için tıkla!`);
    renk.setMaxValues(1);
    renk.setMinValues(1);
    renk.addOptions(renkPush,kaldırrenk);
  

  
    for (const diger in digerler) {
      const sonuc = digerler[diger];
      let table = new disbut.MessageMenuOption()
        .setLabel(message.guild.roles.cache.get(sonuc)?.name)
        .setEmoji(emoji(diger) ? emoji(diger).id : diger)
        .setValue(sonuc)
      digerPush.push(table);
    };
    let kaldırdiger = new disbut.MessageMenuOption()
    .setLabel("Kaldır")
    .setEmoji("888881676703399986")
    .setValue("kaldır")
    let diger = new disbut.MessageMenu();
    diger.setID("diger");
    diger.setPlaceholder(`İlişki rolünü seçmek için tıkla!`);
    diger.setMaxValues(1);
    diger.setMinValues(1);
    diger.addOptions(digerPush,kaldırdiger);
  

    if (args[0] === "burc") {
      message.channel.send(`Aşağıdaki menüye tıklayarak burcuna ait olan rolü seçebilirsin!`, burc);
    }
  
  
    if (args[0] === "oyun") {
      message.channel.send(`Aşağıdaki menüye tıklayarak oynadığın oyunların rollerini seçebilirsin!`, oyun);
    }
  
    if (args[0] === "renk") {
      message.channel.send(`Aşağıdaki menüye tıklayarak dilediğin rengi seçebilirsin!`, renk);
    }
  
  
    if (args[0] === "iliski") {
      message.channel.send(`İlişki durumunuzu seçmek için aşağıdaki menüyü kullanabilirsiniz!`, diger);
    }

    if (args[0] === "etkinlik") {
      message.channel.send(`Etkinlik oyun rollerini seçmek için aşağıdaki menüyü kullanabilirsiniz!`, etkinlik);
    }
  

  };
  
  client.on("clickMenu", async (menu) => {
    if (menu.id == "burc") {
        await menu.reply.think(true);
        await menu.reply.edit("Rollerin güncellendi!");
        let add = [];
        let remove = [];
        let allRemove = [];
        let roller = burclar;
        for (const rol in roller) {
          let sonuc = roller[rol];
          allRemove.push(sonuc);
          if (menu.values.includes(sonuc)) {
          await menu.reply.edit(`Başarılı bir şekilde <@&${sonuc}> rolü üzerinize eklendi!`);
            add.push(sonuc);
          } else {
            remove.push(sonuc);
          };
        };
        if (!menu.values.some(value => value === "allDelete")) {
          if (remove.length > 0) {
            await menu.clicker.member.roles.remove(remove);
    
          };
          await menu.clicker.member.roles.add(add);
        
  
        } else {
          await menu.clicker.member.roles.remove(allRemove);
         
  
        };
        };

  
    if (menu.id == "oyun") {
      await menu.reply.think(true);
      await menu.reply.edit("Rollerin güncellendi!");
      let add = [];
      let remove = [];
      let allRemove = [];
      let roller = oyunlar;
      for (const rol in roller) {
        let sonuc = roller[rol];
        allRemove.push(sonuc);
        if (menu.values.includes(sonuc)) {
            
          await menu.reply.edit(`Başarılı bir şekilde <@&${sonuc}> rolü üzerinize eklendi!`);
          add.push(sonuc);
        } else {
          remove.push(sonuc);
        };
      };
      if (!menu.values.some(value => value === "allDelete")) {
        if (remove.length > 0) {
          await menu.clicker.member.roles.remove(remove);
        };
        await menu.clicker.member.roles.add(add);
      } else {
        await menu.clicker.member.roles.remove(allRemove);

      };
    };
  
    if (menu.id == "renk") {
      await menu.reply.think(true);
      if (!menu.clicker.member.roles.cache.get("894981453421633608")) return await menu.reply.edit("Booster üye olman gerek!");;
      await menu.reply.edit("Rollerin güncellendi!");

      let add = [];
      let remove = [];
      let allRemove = [];
      let roller = renkler;
      for (const rol in roller) {

        let sonuc = roller[rol];  

        allRemove.push(sonuc);
        if (menu.values.includes(sonuc)) {    
          await menu.reply.edit(`Başarılı bir şekilde <@&${sonuc}> rolü üzerinize eklendi!`);

          add.push(sonuc);
        } else {
          remove.push(sonuc);

        };
      };
      if (!menu.values.some(value => value === "allDelete")) {
        if (remove.length > 0) {
          await menu.clicker.member.roles.remove(remove);
        };
        await menu.clicker.member.roles.add(add);
      } else {
        await menu.clicker.member.roles.remove(allRemove);

      };
    };
    if (menu.id == "diger") {
      await menu.reply.think(true);
      await menu.reply.edit("Rollerin güncellendi!");
      let add = [];
      let remove = [];
      let allRemove = [];
      let roller = digerler;
      for (const rol in roller) {
        let sonuc = digerler[rol];
        allRemove.push(sonuc);
        if (menu.values.includes(sonuc)) {
            
          await menu.reply.edit(`Başarılı bir şekilde <@&${sonuc}> rolü üzerinize eklendi!`);
          add.push(sonuc);
        } else {
          remove.push(sonuc);
        };
      };
      if (!menu.values.some(value => value === "allDelete")) {
        if (remove.length > 0) {
          await menu.clicker.member.roles.remove(remove);
         

        };
        await menu.clicker.member.roles.add(add);
      } else {
        await menu.clicker.member.roles.remove(allRemove);
      };
    };

   
    if (menu.id == "etkinlik") {
      await menu.reply.think(true);
      await menu.reply.edit("Rollerin güncellendi!");
      let add = [];
      let remove = [];
      let allRemove = [];
      let roller = etkinlikler;
      for (const rol in roller) {
        let sonuc = etkinlikler[rol];
        allRemove.push(sonuc);
        if (menu.values.includes(sonuc)) {
            
          await menu.reply.edit(`Başarılı bir şekilde <@&${sonuc}> rolü üzerinize eklendi!`);
          add.push(sonuc);
        } else {
          remove.push(sonuc);
        };
      };
      if (!menu.values.some(value => value === "allDelete")) {
        if (remove.length > 0) {
          await menu.clicker.member.roles.remove(remove);
         

        };
        await menu.clicker.member.roles.add(add);
      } else {
        await menu.clicker.member.roles.remove(allRemove);
      };
    };

  });
  
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['menü-kurr'],
    permLevel: 4
  };
  
  exports.help = {
    name: 'menü-kur',
    description: "Menülü rol seçme sistemi kurar.",
    usage: 'menü-kur',
    kategori: "Bot Yapımcısı"
  };