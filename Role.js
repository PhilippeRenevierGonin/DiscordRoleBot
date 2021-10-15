const { MessageEmbed } = require("discord.js");

class RoleReaction {
    constructor(roleId, roleName, reaction ) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.reaction = reaction; // l'emoji
        this.emoji = reaction; // l'emoji
    }
}


class RoleController {
    constructor() {
        this.roleManagers = [];
    }

    addRoleManager(key, manager) {
        this.roleManagers[key] = manager;
    }

    getRoleManager(key) {
        return this.roleManagers[key];
    }

}


class RoleManager {
    constructor(name) {
        this.name = name;
        this.mapReactionRoles = [];
    }

    verifyReaction(emoji) {
        let inside = false;
        for(let i = 0; i < this.mapReactionRoles.length; i++) {
            if (this.mapReactionRoles[i].reaction == emoji) {
                inside = true;
                break;
            }
        }
        return inside;
    }

    addListener(bot) {
        bot.on("messageReactionAdd", async (messageReaction, user) => {
            if (messageReaction.partial) {
                // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
                try {
                    await messageReaction.fetch();
                } catch (error) {
                    console.error('Something went wrong when fetching the message: ', error);
                    // Return as `reaction.message.author` may be undefined/null
                    return;
                }
            }

            if (this.verifyReaction(messageReaction.emoji.name)) {
                console.log("messageReactionAdd sur "+this.name);
                this.addRoleToUser(messageReaction, user);
            }

            
        });
        bot.on("messageReactionRemove", async (messageReaction, user) => {
            if (messageReaction.partial) {
                // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
                try {
                    await messageReaction.fetch();
                } catch (error) {
                    console.error('Something went wrong when fetching the message: ', error);
                    // Return as `reaction.message.author` may be undefined/null
                    return;
                }
            }
            if (this.verifyReaction(messageReaction.emoji.name)) { 
                console.log("messageReactionRemove sur "+this.name);
                this.removeRoleFromUser(messageReaction, user);
            }
        });
    }

    addRoleToUser(reaction, user) {
        if (! user.bot) {
            console.log(`${user.tag} adds ${reaction.emoji.name}`);
            if (! this.mapReactionRoles) return;
            
            const message = reaction.message;
            const member = message.guild.members.cache.get(user.id);
            const emoji = reaction.emoji.name;

            /*
            // add sans condition
            const roleReaction = this.mapReactionRoles.filter(r => {
                return r.reaction == emoji;
            });
            
            if (roleReaction.length == 1) {
                const roleToAdd = message.guild.roles.cache.get(roleReaction[0].roleId);
                member.roles.add(roleToAdd);
            }
            */

            // add exclusif : les autres rôles sont enlevés
            this.mapReactionRoles.forEach(r => {
                if (r.reaction == emoji) {
                    const roleToAdd = message.guild.roles.cache.get(r.roleId);
                    member.roles.add(roleToAdd);
                }
                else {
                    const roleToRemove = message.guild.roles.cache.get(r.roleId);
                    member.roles.remove(roleToRemove);

                    message.reactions.resolve(r.reaction).users.remove(member);
                }
            });

        }
       
    }

    removeRoleFromUser(reaction, user) {
        if (! user.bot) {
            console.log(`${user.tag} removes ${reaction.emoji.name} `);
            if (! this.mapReactionRoles) return;

            const message = reaction.message;
            const member = message.guild.members.cache.get(user.id);
            const emoji = reaction.emoji.name;

            const roleReaction = this.mapReactionRoles.filter(r => {
                return r.reaction == emoji;
            });
            
            if (roleReaction.length == 1) {
                const roleToRemove = message.guild.roles.cache.get(roleReaction[0].roleId);
                member.roles.remove(roleToRemove);
            }
        } 
    }
    
    addRole(roleId, roleName, reaction) {
        let recherche = this.mapReactionRoles.filter(r => (r.roleId == roleId) || (r.roleName == roleName) || (r.reaction == reaction));
        if (recherche.length > 0) {
            console.error("déjà présent", recherche);
        }
        else this.mapReactionRoles.push(new RoleReaction(roleId, roleName, reaction));
    }

    addMessage(message, corps) {
        if (this.mapReactionRoles && (this.mapReactionRoles.length > 0) ) {
            let fieldMsg = "Les rôles disponibles : ";
            this.mapReactionRoles.forEach( r => { 
                fieldMsg = fieldMsg+"\n"+`${r.reaction} - ${r.roleName}`;
            });
    
            const msg = new MessageEmbed().setTitle("Rôles")
            .setDescription(corps+"\n"+fieldMsg); 
            // .addField(fieldMsg); // ajout d'un undefined à la fin du msg... 
    
            
            message.channel.send(msg).then(async m => {
                for(let i = 0; i < this.mapReactionRoles.length; i++) { 
                    await m.react(this.mapReactionRoles[i].reaction);
                };
            });
        }
        else {
            console.log("il n'y a pas de rôle enregistré...");
            const msg = new MessageEmbed().setTitle("Aide /botrole/post").setDescription("il faut d'abord utiliser /botrole/addRole");
            message.channel.send(msg);
        }
        
    }

    sendHelpAddRole(message) {
        const msg = new MessageEmbed().setTitle("Aide /botrole/addRole").setDescription("la commande est du type : /botrole/addRole <id Du Rôle> <nom Du Rôle> <l'emoji std>");
        message.channel.send(msg);
    }
}


module.exports = {RoleController, RoleManager};
