import { enemy } from './../database/enemies';
import { commandExecute } from './../index';
import { sendError } from './../utility/error';
import { player } from './../database/players';
import { User, RichEmbed, Message } from 'discord.js';
import { bot } from '..';
import { actionColor, expMulitplier } from '../config.json';
import { calcReceivedExp, addPlayerExp } from '../mechanics/exp';

export const goHunting: commandExecute = (args, message) => {
  const player = getPlayer(message.author);
  if (!player) {
    sendError('You need to join the game before performing this action');
    return;
  }

  const fightingPlayer: fighter = { ...player, hp: calcHP(player.dex, player.str), isPlayer: true };
  const enemy = createRandomEnemy();

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
};

// TODO: move helper functions to seperate file
function getPlayer(member: User): player | undefined {
  return bot.players.get(member.id);
}

function createRandomEnemy(): enemy {
  const enemyType = bot.enemies.random();
  const modifier = bot.modifiers.random();
  // TODO: add calculation depending on player-lvl
  const lvl = Math.round(Math.random());
  // calculate attributes
  const str = enemyType.str + Math.floor(enemyType.strMultiplier * lvl) + modifier.bonus_str - modifier.malus_str;
  const dex = enemyType.dex + Math.floor(enemyType.dexMultiplier * lvl) + modifier.bonus_dex - modifier.malus_dex;
  const int = enemyType.int + Math.floor(enemyType.intMultiplier * lvl) + modifier.bonus_int - modifier.malus_int;
  const lck = enemyType.lck + Math.floor(enemyType.lckMultiplier * lvl) + modifier.bonus_lck - modifier.malus_lck;
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
function doesPlayerStart(player: fighter, enemy: fighter): Boolean {
  const pInit = (player.int + player.dex * 0.75) * (1 + 0.5 * player.lck);
  const eInit = (enemy.int + enemy.dex * 0.75) * (1 + 0.5 * enemy.lck);
  console.log(`InitCheck | Player: ${pInit}, Enemy: ${eInit} `);
  return pInit > eInit;
}
// placeholder for HP calculation => TODO: playerHP should be stored in DB
function calcHP(dex: number, str: number): number {
  return dex * 4 + str * 10;
}

function fight(player: fighter, enemy: fighter, message: Message): RichEmbed {
  // prepare fightLog
  let fightLog = new RichEmbed().setColor(actionColor).setTitle('FIGHT LOG');
  // determine first hit
  // TODO add check for ranged and meele attack
  let p1: fighter = player;
  let p2: fighter = enemy;

  if (!doesPlayerStart(player, enemy)) {
    p1 = enemy;
    p2 = player;
  }

  // TASK create loop for fight rounds => for loop with a max number auf Rounds? or while loop?
  /* starting with while | BUT remember: JS is singlethreaded =>
   one while loop will prevent the server from performing any other actions
   if it should scale, a good idea might be to implement a microservice dedicated to fight calculations
   */
  while (p1.hp > 0 && p2.hp > 0) {
    // handle long logs
    if (fightLog.fields!.length >= 10) {
      message.author.send(fightLog);
      fightLog = new RichEmbed().setColor(actionColor).setTitle('FIGHT LOG');
    }

    // check for hit:
    // calc hit and dodge change
    // TODO: make calculation depending on enemy lvl
    const hitChance = (p1.dex + p1.int * 0.5) / 10;
    const dodeChance = p2.dex / 10;
    const calcHitChance = hitChance - dodeChance;
    if (Math.random() * 1.05 * p1.lck > 1 - calcHitChance) {
      // check for damage
      // placeholder calculation
      const dmg = Math.round(p1.str + 0.4 * p1.dex + 0.7 * p1.int - (0.4 * p2.dex + 0.2 * p2.str));
      p2.hp -= dmg;
      fightLog.addField(p1.name + ' attacks', `...and hits for ${dmg} Damage.\n ${p2.name} has ${p2.hp} HP remaining.`);
      // TODO: create a real calculation using wapon, armor, etc
      if (p2.hp <= 0) {
        fightLog.addField(`${p1.name} is victorious`, `${p2.name} lost`);
        if (p1.isPlayer) {
          const receivedExp = calcReceivedExp(p1.lvl, p2.lvl);
          addPlayerExp(message.author, receivedExp);
          fightLog.addField(`REWARD`, `You received ${receivedExp}`);
        }
      }
    } else {
      fightLog.addField(p1.name + 'attacks', "...and doesn't hit!");
    }
    // swap players
    const buffer = p1;
    p1 = p2;
    p2 = buffer;
  }

  return fightLog;
}

interface fighter {
  name: string;
  str: number;
  dex: number;
  int: number;
  lck: number;
  lvl: number;
  hp: number;
  isPlayer: boolean;
}
