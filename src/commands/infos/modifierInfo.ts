import { RichEmbed } from 'discord.js';
import { bot } from '../../index';
import { infoColor } from '../../config.json';
import { commandExecute, modifier } from '../../dataTypes/interfaces';

export const modifierInfo: commandExecute = (args, message) => {
  let embed = new RichEmbed().setColor(infoColor).setTitle('Available Modifiers');
  bot.modifiers.forEach(mod => {
    embed.addField(mod.name, getAffectedAttributes(mod));
  });
  message.reply(embed);
};

function getAffectedAttributes(mod: modifier): string {
  const { id, name, message, ...attr } = mod;
  let attributes: string[] = [];
  for (let [key, value] of Object.entries(attr)) {
    if (value > 0) {
      const keyNames = key.split('_');
      const info = `${keyNames[1].toUpperCase()} ${keyNames[0] === 'malus' ? '-' : '+'} ${value}`;
      attributes.push(info);
    }
  }
  if (attributes.length === 0) {
    return 'no Attributes are affected';
  }
  return attributes.join('\n');
}
