import { fighter, enemy, player } from './../dataTypes/interfaces';
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

function hasAdvantageHit(player: fighter, enemy: fighter): advantageHitType {
  if (
    player.weapon &&
    player.weapon.weaponType === 'ranged' &&
    (!enemy.weapon || enemy.weapon.weaponType === 'meele')
  ) {
    return 'player';
  } else if (
    enemy.weapon &&
    enemy.weapon.weaponType === 'ranged' &&
    (!player.weapon || player.weapon.weaponType === 'meele')
  ) {
    return 'enemy';
  } else {
    return 'none';
  }
}

function calculateHit(attacker: fighter, defender: fighter, fightLog: RichEmbed, isAdvantageHit: Boolean) {
  // check for hit:
  // calc hit and dodge change
  const hitChance = (attacker.dex + attacker.int * 0.5) / 10;
  const dodeChance = defender.dex / 10;
  const calcHitChance = hitChance - dodeChance;
  if (Math.random() * 1.05 * attacker.lck > 1 - calcHitChance) {
    // check for damage
    // placeholder calculation
    // TODO: create a real calculation using wapon, armor, etc
    const dmg = Math.round(
      attacker.str * (attacker.weapon && attacker.weapon.baseDMG ? attacker.weapon.baseDMG / 5 : 1) +
        0.4 * attacker.dex +
        0.7 * attacker.int -
        (0.4 * defender.dex + 0.2 * defender.str)
    );
    defender.hp -= dmg;
    fightLog.addField(
      isAdvantageHit ? 'Advantage Hit for: ' + attacker.name : attacker.name + ' attacks',
      `...and hits for ${dmg} Damage.\n ${defender.name} has ${defender.hp} HP remaining.`
    );
  } else {
    fightLog.addField(attacker.name + 'attacks', "...and doesn't hit!");
  }
}

export async function fight(player: fighter, enemy: fighter, message: Message): Promise<RichEmbed> {
  // prepare fightLog
  let fightLog = new RichEmbed().setColor(actionColor).setTitle('FIGHT LOG');

  let p1: fighter = player;
  let p2: fighter = enemy;

  // check advantage hit
  switch (hasAdvantageHit(player, enemy)) {
    case 'player':
      calculateHit(p1, p2, fightLog, true);
      break;
    case 'enemy':
      calculateHit(p2, p1, fightLog, true);
      break;
    case 'none':
      break;
  }

  // determine first hit
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
    calculateHit(p1, p2, fightLog, false);
    if (p2.hp <= 0) {
      fightLog.addField(`${p1.name} is victorious`, `${p2.name} lost`);
      if (p1.isPlayer) {
        const receivedExp = calcReceivedExp(p1.lvl, p2.lvl);
        // TODO: add error handling!
        addPlayerExp(message.author, receivedExp);
        const loot = await addPlayerLoot(player, enemy);
        fightLog.addField(
          `REWARD`,
          `You received ${receivedExp} EXP \n ${loot ? 'Loot: ' + loot : 'You found nothing of worth'}`
        );
      }
    }

    // swap players
    const buffer = p1;
    p1 = p2;
    p2 = buffer;
  }

  return fightLog;
}
