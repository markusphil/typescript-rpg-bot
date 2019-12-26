import { sendError } from './../utility/error';
import { player } from './../database/players';
import { commandExecute, bot } from './../index';
import { successColor } from '../config.json';
import { RichEmbed } from 'discord.js';
import { getPlayer } from '../utility/playerUtility';

export const improveAttributes: commandExecute = (args, message) => {
  console.log('start training');
  const player = getPlayer(message.author);

  if (player.ap === 0) {
    sendError("Sorry, but you don't have any Attribute Points left");
  }

  const attributes: attribute[] = args.filter(isValidAttribute);

  if (attributes.length === 0) {
    sendError("you didn't provide valid attributes as argument.\n only 'str', 'dex', 'int' and 'lck' are allowed");
  }

  const updatedAttributes = updateAttributes(player, attributes);
  if (updatedAttributes.length) {
    const emb = new RichEmbed()
      .setColor(successColor)
      .setTitle('Attributes Improved')

      .addField(`spend ${updatedAttributes.length} AP to increase`, updatedAttributes.join(', '))
      .addField(
        'New Stats:',
        `
      Strength: ${player.str} \n
      Dexterity: ${player.dex} \n
      Intelligence: ${player.int} \n
      Luck: ${player.lck}
    `
      );

    bot.playerRepo
      .addAttributes(player.str, player.dex, player.int, player.lck, player.ap)
      .then(() => {
        message.author.send(emb);
      })
      .catch(err => console.log(err));
  }
};
// create a typeguard function
function isValidAttribute(el: string): el is attribute {
  return el === 'str' || el === 'dex' || el === 'int' || el === 'lck';
}

function updateAttributes(player: player, attributes: attribute[]): attribute[] {
  let updatedAttributes: attribute[] = [];
  attributes.forEach(att => {
    if (player.ap > 0) {
      // update playerData in place and push the updated state to the database
      // This is kinda risky cause it will create errors when the bot's state gets out of sync...
      // I guess it'll be a better practice to rely on the DB as source of truth
      player[att] += 1;
      player.ap -= 1;
      updatedAttributes.push(att);
    }
  });
  return updatedAttributes;
}

type attribute = 'str' | 'dex' | 'int' | 'lck';
