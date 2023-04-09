const Discord = require('discord.js-selfbot-v13')
const fs = require("fs");
const statuss = ['online', 'dnd', 'idle']
require("express")().listen(3000)

process.on("unhandledRejection", err => {
  console.log(err)
});
process.on("uncaughtException", err => {
  console.log(err)
});
process.on("uncaughtExceptionMonitor", err => {
  console.log(err)
});

let owners = {
  'server1': ['', ''],
  'server2': ['', ''],
  'server3': ['', ''],
  'server4': ['', ''],
  'server5': ['', ''],
}

const tokens = fs.readFileSync('tokens.txt', 'utf-8').replace(/\r|\x22/gi, '').split('\n');
if (tokens.length == 0 || !tokens[0][0]) return console.log('There is no tokens in file .')
for (let i = 0; i < tokens.length; i++) {
  let c = tokens[i]
  const client = new Discord.Client({ checkUpdate: false, intents: 32767 });
  client.on("ready", () => {
    let status = statuss[Math.floor(Math.random() * statuss.length)]
    client.user.setStatus(status)
    console.log(`\x1b[32m${client.user.username}\x1b[0m - Ready to add reactions`)
  })
  client.on("messageCreate", async message => {
    if (owners[message.guild.id] && !owners[message.guild.id].includes(message.author.id)) return;
    if (message.content.includes("بدون شروط") || message.content.includes("شارك بس") || message.content.includes("@here") || message.content.includes("@everyone")) {
      let allMessages;
      try {
        allMessages = await message.channel.messages.fetch({ limit: 30 }).catch(err => 0)
      } catch (err) {
        allMessages = null
      }
      if (!allMessages) return;
      allMessages = allMessages.filter(e => e.reactions.cache.size >= 1)
      allMessages.forEach(async messager => {
        let reactions = messager.reactions.cache;
        if (reactions.size > 0) {
          reactions.forEach(reaction => {
            messager.react(reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name).catch(err => 0)
          })
        }
      })
    }
  })
  client.login(c).catch(Err => console.log("\x1b[31mFAILED " + c + '\x1b[0m'))
}