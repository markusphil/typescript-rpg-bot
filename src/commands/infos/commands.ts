import { RichEmbed } from 'discord.js';
import { bot } from '../../index';
import { infoColor } from '../../config.json';
import { commandExecute } from '../../dataTypes/interfaces';

export const helpInfo: commandExecute = (args, message) => {
  let embed = new RichEmbed().setColor(infoColor).setTitle('Available Info Commands');
  bot.infos.forEach(info => {
    embed.addField(info.usage ? '?' + info.name + ' ' + info.usage : '?' + info.name, info.description);
  });
  message.reply(embed);
};

export const actionsInfo: commandExecute = (args, message) => {
  let embed = new RichEmbed().setColor(infoColor).setTitle('Available Action Commands');
  bot.actions.forEach(action => {
    embed.addField(action.usage ? '!' + action.name + ' ' + action.usage : '!' + action.name, action.description);
  });
  message.reply(embed);
};
