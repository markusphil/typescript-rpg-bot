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
