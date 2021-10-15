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

const { RoleController, RoleManager } = require("./Role.js");
const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });


const roleManager = new RoleManager("groupe");
const roleController = new RoleController();
roleManager.addListener(bot);

const altManager = new RoleManager("alternant");
altManager.addListener(bot);

roleController.addRoleManager("groupe", roleManager);
roleController.addRoleManager("alternance", altManager);


bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  // filtre sur le channel 

  console.dir(msg.channel.id);

  if (msg.channel.id != '881811010938368050') {
    console.log("pas sur le bon channel...")
    return ;
  }
  
  // filtre sur le préfixe ou si c'est un message du bot
  if (! msg.content.startsWith(`${PREFIX}`) || msg.author.bot) return;

  // todo, sur plusieurs lignes
  const lignes = msg.content.trim().split("\n");

  lignes.forEach(l => {
    const ligne = l.trim();
    let args = ligne.trim().slice(PREFIX.length).split(/ +/);
    console.log(args);



  
    if (ligne.startsWith(`${PREFIX}addRole`)) {
      let tailleEneteteCmd = `${PREFIX}addRole`.length;
      let premierEspace = ligne.indexOf(" ");
      let key = "groupe";
      if (premierEspace > 0) key = ligne.substring(tailleEneteteCmd+1, premierEspace);
      else key = ligne.substring(tailleEneteteCmd+1);
      key = key.trim();
  
      console.log(key);

      if (args.length == 4) roleController.getRoleManager(key).addRole(args[1], args[2], args[3]);
      else roleController.getRoleManager(key).sendHelpAddRole(msg);
    }
    else if (ligne.startsWith(`${PREFIX}post`)) {
      let tailleEneteteCmd = `${PREFIX}post`.length;
      let premierEspace = ligne.indexOf(" ");
      let key = "groupe";
      if (premierEspace > 0) key = ligne.substring(tailleEneteteCmd+1, premierEspace);
      else key = ligne.substring(tailleEneteteCmd+1);
      key = key.trim();
  
      console.log(key);

      roleController.getRoleManager(key).addMessage(msg, "Cliquez sur une des réactions ci-dessous pour obtenir le rôle correspondant");
    }
  })
  

});

bot.login(TOKEN);


if (config.INIT_EMOJIS) {
  roleController.getRoleManager("groupe").addRole("880823345858367568", "TD1", "1️⃣");
  roleController.getRoleManager("groupe").addRole("880823712037884104", "TD2", "2️⃣");
  roleController.getRoleManager("groupe").addRole("880823859199225917", "TD3", "3️⃣");

  roleController.getRoleManager("alternance").addRole("898538959225884683", "non_alternant·e", "🎓");
  roleController.getRoleManager("alternance").addRole("898538365119520828", "alternant·e", "🏭");


}


// https://emojiterra.com/fr/keycap-3/
// ref : https://www.youtube.com/watch?v=UdIzwu7d9LY&list=PLuWyq_EO5_ALOnpxptlqQA5FR75Nza2PQ&index=26


/* 
/botrole/addRole/groupe 880823345858367568 TD1 :one: 
/botrole/addRole/groupe 880823712037884104 TD1 :two: 
/botrole/addRole/groupe 880823859199225917 TD3 :three:


/botrole/addRole/alternance 898538959225884683 non_alternant·e :mortar_board:
/botrole/addRole/alternance 898538365119520828 alternant·e :factory:

/botrole/post/groupe
/botrole/post/alternance



*/