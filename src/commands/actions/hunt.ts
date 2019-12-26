import { enemy } from '../../database/enemies';
import { commandExecute } from '../../index';
import { sendError } from '../../utility/error';
import { RichEmbed } from 'discord.js';
import { bot } from '../..';
import { actionColor } from '../../config.json';

import { getPlayer } from '../../utility/playerUtility';
import { fight, fighter } from '../../mechanics/fight';

export const goHunting: commandExecute = (args, message) => {
  try {
    const player = getPlayer(message.author);
    const fightingPlayer: fighter = { ...player, hp: calcHP(player.dex, player.str), isPlayer: true };
    const enemy = createRandomEnemy(player.lvl);

    const embed = new RichEmbed().setColor(actionColor);
    embed
      .setTitle('You went out for a Hunt')
      .setDescription(`after a while of striving through the forest you've found a ${enemy.modifier} ${enemy.name}`)
      .addField(
        'Stats',
        `
        Lvl: ${enemy.lvl} \n
        Strength: ${enemy.str}\n
        Dexterity: ${enemy.dex}\n
        Intelligence: ${enemy.int}\n
        Luck: ${enemy.lck}\n
        HP: ${enemy.hp}
    `
      );
    message.author.send(embed);

    const fightLog = fight(fightingPlayer, enemy, message);
    message.author.send(fightLog);
  } catch (err) {
    console.log(err);
    sendError('You need to join the game before performing this action');
    return;
  }
};

function createRandomEnemy(baseLvl: number): enemy {
  const enemyType = bot.enemies.random();
  const modifier = bot.modifiers.random();
  // calculation: player LVL +/- 2
  let lvl = baseLvl + Math.round((Math.random() - 0.5) * 4);
  if (lvl < 1) lvl = 1;
  // calculate attributes
  const str = enemyType.str + Math.round(enemyType.strMultiplier * lvl) + modifier.bonus_str - modifier.malus_str;
  const dex = enemyType.dex + Math.round(enemyType.dexMultiplier * lvl) + modifier.bonus_dex - modifier.malus_dex;
  const int = enemyType.int + Math.round(enemyType.intMultiplier * lvl) + modifier.bonus_int - modifier.malus_int;
  const lck = enemyType.lck + Math.round(enemyType.lckMultiplier * lvl) + modifier.bonus_lck - modifier.malus_lck;
  const hp = calcHP(dex, str);
  return {
    name: enemyType.name,
    description: enemyType.description,
    modifier: modifier.name,
    lvl: lvl,
    str: str,
    dex: dex,
    int: int,
    lck: lck,
    hp: hp,
    isPlayer: false,
  };
}

// placeholder for HP calculation => TODO: playerHP should be stored in DB
function calcHP(dex: number, str: number): number {
  return dex * 4 + str * 10;
}
