import { sendError } from '../../utility/error';
import { RichEmbed } from 'discord.js';
import { bot } from '../../index';
import { infoColor } from '../../config.json';
import { getLvlBoundry } from '../../mechanics/exp';
import { commandExecute } from '../../dataTypes/interfaces';

export const playerInfo: commandExecute = (args, message) => {
  const embed = new RichEmbed()
    .setColor(infoColor)
    .setTitle('Registered Players')
    .setDescription(bot.players.map(player => player.name + ' | ' + player.modifier + ' ' + player.race).join('\n'));
  message.reply(embed);
};

export const activePlayerInfo: commandExecute = (args, message) => {
  const player = bot.players.get(message.author.id);
  if (!player) {
    sendError("Ooops it looks like you didn't join the game yet!", message);
  } else {
    const lvlBoundry = getLvlBoundry(player.lvl);
    const embed = new RichEmbed()
      .setColor(infoColor)
      .setTitle('Your Stats')
      .addField('Race', player.race)
      .addField('Modifier', player.modifier)
      .addField(
        'Attributes',
        `Strength: ${player.str}\n Dexterity: ${player.dex}\n Intelligence: ${player.int}\n Luck: ${player.lck}`
      )
      .addField(
        'Level Stats:',
        `LVL: ${player.lvl}\n Exp: ${player.exp} / ${lvlBoundry}\n Attribute Points: ${player.ap}`
      );
    message.author.send(embed);
  }
};
