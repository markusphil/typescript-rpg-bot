import { fighter, enemy } from './../dataTypes/interfaces';
import { RichEmbed, Message } from 'discord.js';
import { actionColor } from '../config.json';
import { calcReceivedExp, addPlayerExp } from './exp';
import { addPlayerLoot } from './loot';

function doesPlayerStart(player: fighter, enemy: fighter): Boolean {
  const pInit = (player.int + player.dex * 0.75) * (1 + 0.5 * player.lck);
  const eInit = (enemy.int + enemy.dex * 0.75) * (1 + 0.5 * enemy.lck);
  console.log(`InitCheck | Player: ${pInit}, Enemy: ${eInit} `);
  return pInit > eInit;
}

export async function fight(player: fighter, enemy: fighter, message: Message): Promise<RichEmbed> {
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
          // add error handling!
          addPlayerExp(message.author, receivedExp);
          const loot = await addPlayerLoot(player, enemy);
          fightLog.addField(
            `REWARD`,
            `You received ${receivedExp} EXP \n ${loot ? 'Loot: ' + loot : 'You found nothing of worth'}`
          );
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
