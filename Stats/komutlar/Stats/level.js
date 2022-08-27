const { MessageAttachment } = require("discord.js");
const profilManager = require("../../models/profilmanager")
const canvacord = require("canvacord");
module.exports.run = async (client, message, args, durum, kanal) => {
	if (!message.guild) return;

    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    const data = await profilManager.findOne({ user: target.id, guild: message.guild.id });
    if (!data) return message.reply("Level verisi görüntülenemiyor!");

    let xpToNextLevel = 5 * Math.pow((data?.level?.message?.level || 0), 2) + 50 * (data?.level?.message?.level || 0) + 100;
    let loading = await message.channel.send("Level verisi yükleniyor...");

    let num = 0;
    const img = target.user.avatarURL({ format: "png" });
    const rank = new canvacord.Rank();
    rank.setBackground("COLOR", "#23272a")
    rank.setAvatar(img)
    rank.setCurrentXP((data?.level?.message?.xp || 0))
    rank.setRank(num, "#Rank", false)
    rank.setLevelColor("#62d3f5")
    rank.setLevel((data?.level?.message?.level || 0), "Level", true)
    rank.setOverlay("#090a0b", 10, true)
    rank.setRequiredXP(xpToNextLevel, "#7a7e7f")
    rank.setStatus(target.presence.status)
    rank.setProgressBar("#62d3f5", "COLOR")
    rank.setUsername(target.user.username, "#ffffff")
    rank.setDiscriminator(target.user.discriminator, "#7a7e7f");

    rank.build().then(data => {
      const attachment = new MessageAttachment(data, "mirage.png");
      loading.delete().catch(() => {});
      message.channel.send(attachment);
    });
}

exports.conf = {
  aliases: ["level"]
}
exports.help = {
  name: 'Level'
}