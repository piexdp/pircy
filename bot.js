const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
client.queue = new Map()
const chalk = require('chalk');
const fs = require('fs');
const Jimp = require('jimp');
const db = require('quick.db');
const Canvas = require('canvas')
const ms = require('parse-ms')
const moment = require('moment');

require('./util/eventLoader')(client);
var prefix;




client.ayarlar = {
yardimcilar: ["383716373924413441"],
renk:"RANDOM", 
};

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} Komut Yükleniyor...`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen Komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.on('message',msg =>{
prefix=db.fetch(`prefix_${msg.guild.id}`)
  if(!prefix) prefix=ayarlar.prefix
  if(msg.content===`${prefix}`){
    msg.channel.send({embed:{ color: Math.floor(Math.random() * (0xFFFFFF + 1)), description:(`${prefix}yardım komutu ile tüm komutlarımı oğrenebilirsiniz.`)}})
  }
})

client.on("guildMemberAdd",member=>{
  if(db.has(`otorolKanal_${member.guild.id}`)==true && db.has(`otorol_${member.guild.id}`)==true){
      var kanal=member.guild.channels.get(db.fetch(`otorolKanal_${member.guild.id}`))
      var rol=member.guild.roles.get(db.fetch(`otorol_${member.guild.id}`))
    member.addRole(rol).then(kanal.send({embed:{ color: Math.floor(Math.random() * (0xFFFFFF + 1)), description:(`${member.user.tag} :loudspeaker: :white_check_mark: Hoşgeldin ${rol.name} Rolün Başarıyla Verildi.`)}})).catch(err=>{return kanal.send(`Hata oluştu rollerimin sırasını kontrol et.`)})
   
  }
  })


client.on('message', msg => {
if (!msg.content.startsWith(prefix)) {
    return;
  }

  });


client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};




client.on("ready",()=>{
  client.user.setActivity(`${ayarlar.prefix}yardım | v0.0.3`);
})

client.login(ayarlar.token);


//////////////////////////////////////////////////////////
client.on("guildCreate", guild => { 
const tesekkurler = new Discord.RichEmbed()
.setTimestamp()
.setColor('RONDOM')
.setDescription(`Beni Sunucuna Eklediğin İçin Teşekkürler Herhangi Bir Sorun Olursa Piex#9006 ya ulaşabilirsin`)
guild.owner.send(tesekkurler)


});

/////////////////////////////////

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
    msg.reply('Aleyküm selam');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'piex') {
    msg.reply('sana sesleniyor <@381421188616028161>');
  }
});




//////////////////////////modlog//////////////////
client.on('messageDelete', async message   => { // mod-log
      let modlogs = db.get(`tc-modlog_${message.guild.id}`)
    const modlogkanal = message.guild.channels.find(kanal => kanal.id === modlogs);    
if (!modlogkanal) return;
  const embed = new Discord.RichEmbed()
  .setColor("BLUE")
  .setTitle("MESAJ SİLİNDİ")
.setDescription(`<@!${message.author.id}> adlı kullanıcı tarafından <#${message.channel.id}> kanalına gönderilen mesaj silindi!\n\nSilinen Mesaj: **${message.content}**`)
  .setFooter("Pixie Bot | Log Sistemi")
  modlogkanal.sendEmbed(embed);
  })


client.on('guildBanAdd', async message  => {
      let modlogs = db.get(`tc-modlog_${message.guild.id}`)
    const modlogkanal = message.guild.channels.find(kanal => kanal.id === modlogs);    
if (!modlogkanal) return;
  const embed = new Discord.RichEmbed()
  .setColor("BLUE")

	.setDescription(`Üye Sunucudan Yasaklandı! \n<@!${message.user.id}>, ${message.user.tag}`)
		.setThumbnail(message.user.avatarURL)
  .setFooter("Pixie Bot | Log Sistemi")
  modlogkanal.sendEmbed(embed);
  })
client.on('channelCreate', async channel  => {
      let modlogs = db.get(`tc-modlog_${channel.guild.id}`)
    const modlogkanal = channel.guild.channels.find(kanal => kanal.id === modlogs);    
if (!modlogkanal) return;
	if (channel.type === "text") {
				let embed = new Discord.RichEmbed()
					.setColor('RANDOM')
				.setDescription(`${channel.name} adlı metin kanalı oluşturuldu.`)
				.setFooter(`Pixie Bot | Log Sistemi Kanal ID: ${channel.id}`)
				modlogkanal.send({embed});
			};
			if (channel.type === "voice") {
				let embed = new Discord.RichEmbed()
				.setColor('RANDOM')
.setTitle("SES KANALI OLUŞTURULDU")
				.setDescription(`${channel.name} adlı ses kanalı oluşturuldu!`)
				.setFooter(`Pixie Bot | Log Sistemi Kanal ID: ${channel.id}`)

				modlogkanal.send({embed});
			}
		
	})
client.on('channelDelete', async channel  => {
      let modlogs = db.get(`tc-modlog_${channel.guild.id}`)
    const modlogkanal = channel.guild.channels.find(kanal => kanal.id === modlogs);    
if (!modlogkanal) return;
	if (channel.type === "text") {
				let embed = new Discord.RichEmbed()
					.setColor('RANDOM')
				.setDescription(`${channel.name} adlı metin kanalı silindi`)
				.setFooter(`Pixie Bot | Log Sistemi Kanal ID: ${channel.id}`)
				modlogkanal.send({embed});
			};
			if (channel.type === "voice") {
				let embed = new Discord.RichEmbed()
				.setColor('RANDOM')
.setTitle("SES KANALI SİLİNDİ")
				.setDescription(`${channel.name} adlı ses kanalı silindi`)
			.setFooter(`Pixie Bot | Log Sistemi  Kanal ID: ${channel.id}`)
				modlogkanal.send({embed});
			}
	})
client.on("messageUpdate", async (oldMsg, newMsg) => {
  if (oldMsg.author.bot) return;
  var user = oldMsg.author;
  if (db.has(`tc-modlog_${oldMsg.guild.id}`) === false) return;
  var kanal = oldMsg.guild.channels.get(db.fetch(`tc-modlog_${oldMsg.guild.id}`).replace("<#", "").replace(">", ""))
  if (!kanal) return;
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .addField("Kullanıcı", oldMsg.author.tag, true)
  .addField("Eski Mesaj",`  ${oldMsg.content}  `)
  .addField("Yeni Mesaj", `${newMsg.content}`)
  .setThumbnail(oldMsg.author.avatarURL)
  kanal.send(embed);  
		
	})

////////////////////////// sunucuya eklendim ve atıldım


client.on("guildCreate", guild => { 
let add = client.channels.get("755711657182756875")
const eklendim = new Discord.RichEmbed()

.setTitle(`Sunucuya Eklendim`)
.setTimestamp()
.setColor("GREEN")
.setThumbnail(guild.iconURL)
.addField(`Sunucu İsmi`,guild.name)
.addField(`Sunucu ID`, guild.id)
.addField(`Kurucu`,guild.owner.user.tag)
.addField(`Kurucu ID`,guild.owner.user.id)
.addField(`Üye Sayısı`,guild.memberCount)

add.send(eklendim)

});

client.on("guildDelete", guild => {
let remove = client.channels.get("755711657182756875")
const atildim = new Discord.RichEmbed()

.setTitle(`Sunucudan Atıldım`)
.setTimestamp()
.setColor("RED")
.setThumbnail(guild.iconURL)
.addField(`Sunucu İsmi`,guild.name)
.addField(`Sunucu ID`, guild.id)
.addField(`Kurucu`,guild.owner.user.tag)
.addField(`Kurucu ID`,guild.owner.user.id)
.addField(`Üye Sayısı`,guild.memberCount)

remove.send(atildim)

});

///////////////////////////////////////////////////
client.on("guildMemberAdd", async member => {
  const fs = require("fs");
  let gkanal = JSON.parse(fs.readFileSync("./ayarlar/glog1.json", "utf8"));
  const gözelkanal = member.guild.channels.get(gkanal[member.guild.id].resim);
  if (!gözelkanal) return;
  let username = member.user.username;
  if (gözelkanal === undefined || gözelkanal === null) return;
  if (gözelkanal.type === "text") {
    const bg = await Jimp.read(
      "https://cdn.discordapp.com/attachments/704827286590849024/714183054603583528/indir.png"
    );
    const userimg = await Jimp.read(member.user.avatarURL);
    var font;
    if (member.user.tag.length < 10)
      font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    else if (member.user.tag.length > 0)
      font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    await bg.print(font, 430, 170, member.user.tag);
    await userimg.resize(362, 362); ////boyut
    await bg.composite(userimg, 43, 26).write("./img/" + member.id + ".png"); ///sağa sola, yukarı aşşa
    setTimeout(function() {
      gözelkanal.send(new Discord.Attachment("./img/" + member.id + ".png"));
    }, 1000);
    setTimeout(function() {
      fs.unlink("./img/" + member.id + ".png");
    }, 10000);
  }
});

/////////////bb-kanal
client.on("guildMemberRemove", async member => {
  const fs = require("fs");
  let gkanal = JSON.parse(fs.readFileSync("./ayarlar/glog1.json", "utf8"));
  const gözelkanal = member.guild.channels.get(gkanal[member.guild.id].resim);
  if (!gözelkanal) return;
  let username = member.user.username;
  if (gözelkanal === undefined || gözelkanal === null) return;
  if (gözelkanal.type === "text") {
    const bg = await Jimp.read(
      "https://cdn.discordapp.com/attachments/704827286590849024/714183098526597160/indir_1.png"
    );
    const userimg = await Jimp.read(member.user.avatarURL);
    var font;
    if (member.user.tag.length < 10)
      font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    else if (member.user.tag.length > 0)
      font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    await bg.print(font, 430, 170, member.user.tag);
    await userimg.resize(362, 362); ////boyut
    await bg.composite(userimg, 43, 26).write("./img/" + member.id + ".png"); ///sağa sola, yukarı aşşa
    setTimeout(function() {
      gözelkanal.send(new Discord.Attachment("./img/" + member.id + ".png"));
    }, 1000);
    setTimeout(function() {
      fs.unlink("./img/" + member.id + ".png");
    }, 10000);
  }
});
/////////////////sayaç sistemi///////////////////
client.on("guildMemberAdd", async member => {
  let sayac = await db.fetch(`sayac_${member.guild.id}`);
  let skanal9 = await db.fetch(`sayacK_${member.guild.id}`);
  if (!skanal9) return;
  const skanal31 = member.guild.channels.find("name", skanal9);
  if (!skanal31) return;
  skanal31.send({embed: {color: Math.floor(Math.random() * (0xFFFFFF + 1)),description: (`${member.user.tag} Adlı Kullanıcı Sunucuya Katıldı. ${sayac} Kullanıcı Olmaya \`${sayac -member.guild.members.size}\` Kullanıcı Kaldı. ✅`)}})
   
});

client.on("guildMemberRemove", async member => {
  let sayac = await db.fetch(`sayac_${member.guild.id}`);
  let skanal9 = await db.fetch(`sayacK_${member.guild.id}`);
  if (!skanal9) return;
  const skanal31 = member.guild.channels.find("name", skanal9);
  if (!skanal31) return;
  skanal31.send({embed: {color: Math.floor(Math.random() * (0xFFFFFF + 1)),description: (`${member.user.tag} Adlı Kullanıcı Sunucudan Ayrıldı. ${sayac} Kullanıcı Olmaya ${sayac -member.guild.members.size} Kullanıcı Kaldı. ❌`)}})
});

//////////////////

