import { sendError } from './../utility/error';
import { RichEmbed } from 'discord.js';
import { bot, commandExecute } from '../index';
import { infoColor } from '../config.json';

export const playerInfo: commandExecute = (args, message) => {
  let embed = new RichEmbed()
    .setColor(infoColor)
    .setTitle('Registered Players')
    .setDescription(bot.players.map(player => player.name + ' | ' + player.race).join('\n'));
  message.reply(embed);
};

export const activePlayerInfo: commandExecute = (args, message) => {
  const player = bot.players.get(message.author.id);
  if (!player) {
    sendError("Ooops it looks like you didn't join the game yet!", message);
  } else {
    const embed = new RichEmbed()
      .setColor(infoColor)
      .setTitle('Your Stats')
      .addField('Race', player.race)
      .addField(
        'Attributes',
        `Strength: ${player.str}\n Dexterity: ${player.dex}\n Intelligence: ${player.int}\n Luck: ${player.lck}`
      );
    message.author.send(embed);
  }
};
