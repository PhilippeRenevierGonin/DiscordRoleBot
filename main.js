const { Client, Message } = require('discord.js');


/**** hosting at home = a config.js exists ****/
/**** hosting at repl.it = env... ****/

const {existsSync} = require('fs')
let config;
if (existsSync("./config.js")) {
  config = require("./config.js");
}
else {
  // hosting on repl.it
  config = {};
  config.TOKEN = process.env.TOKEN;
  config.PREFIX = process.env.PREFIX;
  config.INIT_EMOJIS = process.env.INIT_EMOJIS;

// launching a web server to be ping every 5 minutes. 
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
}

const TOKEN = config.TOKEN;
const PREFIX = config.PREFIX;
/************************************************/

const { RoleManager } = require("./Role.js");
const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });


const roleManager = new RoleManager();
roleManager.addListener(bot);

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (! msg.content.startsWith(`${PREFIX}`) || msg.author.bot) return;
  // todo, sur plusieurs lignes
  const lignes = msg.content.trim().split("\n");

  lignes.forEach(l => {
    const ligne = l.trim();
    let args = ligne.trim().slice(PREFIX.length).split(/ +/);
    console.log(args);
  
    if (ligne.startsWith(`${PREFIX}addRole`)) {
      if (args.length == 4) roleManager.addRole(args[1], args[2], args[3]);
      else roleManager.sendHelpAddRole(msg);
    }
    else if (ligne.startsWith(`${PREFIX}post`)) {
      roleManager.addMessage(msg, "Cliquez sur une des réactions ci-dessous pour obtenir le rôle correspondant");
    }
  })
  

});

bot.login(TOKEN);


if (config.INIT_EMOJIS) {
  roleManager.addRole("819579064645320745", "M1", "1️⃣");
  roleManager.addRole("819579183163637820", "IA2", "🧠");
  roleManager.addRole("819579096672501852", "Intense", "🇮");
  roleManager.addRole("819579139840540737", "Mbds", "🇲");
  roleManager.addRole("819579212708315206", "Siris", "🇸");
  roleManager.addRole("819583710574805023", "L3", "🇱");
}



// ref : https://www.youtube.com/watch?v=UdIzwu7d9LY&list=PLuWyq_EO5_ALOnpxptlqQA5FR75Nza2PQ&index=26


/* 
/botrole/addRole 819579064645320745 M1 :one: 
/botrole/addRole 819579183163637820 IA2 :brain:
/botrole/addRole 819579096672501852 Intense :regional_indicator_i:
/botrole/addRole 819579139840540737 Mbds :regional_indicator_m:
/botrole/addRole 819579212708315206 Siris :regional_indicator_s:
/botrole/addRole 819583710574805023 L3 :regional_indicator_l:
/botrole/post
*/