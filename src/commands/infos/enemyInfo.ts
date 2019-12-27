import { sendError } from '../../utility/error';
import { RichEmbed } from 'discord.js';
import { bot } from '../../index';
import { infoColor } from '../../config.json';
import { capitalize } from 'lodash';
import { commandExecute } from '../../dataTypes/interfaces';

export const enemiesInfo: commandExecute = (args, message) => {
  let embed = new RichEmbed().setColor(infoColor).setTitle('Known Enemies');
  bot.enemies.forEach(en => {
    embed.addField(en.name, en.description);
  });
  message.reply(embed);
};

export const singleEnemyInfo: commandExecute = (args, message) => {
  const embed = new RichEmbed().setColor(infoColor);
  if (args.length > 0) {
    const enemy = bot.enemies.find(en => en.name === capitalize(args[0]));
    if (enemy) {
      embed
        .setTitle(enemy.name)
        .setDescription(enemy.description)
        .addField(
          'Base Attributes',
          `Strength: ${enemy.str}\n
            Dexterity: ${enemy.dex}\n
            Intelligence: ${enemy.int}\n
            Luck: ${enemy.lck}`
        );
    } else {
      sendError(`Enemy "${args[0]}" not found`, message);
      return;
    }
  } else {
    randomEnemy(embed);
  }
  message.reply(embed);
};

function randomEnemy(embed: RichEmbed) {
  const randomEnemy = bot.enemies.random();
  embed.setTitle('Random Enemy: ' + randomEnemy.name).setDescription(randomEnemy.description);
}
