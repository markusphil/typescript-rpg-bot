import { player } from './../database/players';
import { expMulitplier, expBasis, apPerLvl, successColor } from '../config.json';
import { bot } from '..';
import { User, RichEmbed } from 'discord.js';
import { getPlayer } from '../utility/playerUtility';

export function calcReceivedExp(plvl: number, elvl: number): number {
  const calcExp = expMulitplier * (5 + 0.5 * (elvl - plvl));
  return calcExp > 0 ? calcExp : 0;
}

export function addPlayerExp(member: User, exp: number) {
  const player = getPlayer(member);
  if (!player) throw new Error('Player not Found!');
  // check lvl boundry
  const boundry = getLvlBoundry(player.lvl);
  let newExp = player.exp + exp;
  let newlvl = player.lvl;
  let newAp = player.ap;
  if (newExp >= boundry) {
    newlvl += 1;
    newAp += apPerLvl;
    newExp -= boundry;
    // send lvlUp Message?
    const emb = new RichEmbed()
      .setColor(successColor)
      .setTitle('LVL UP')
      .setDescription(
        `
        Congratulations ${player.name}, \n
        You reached ${newlvl}!`
      )
      .addField('Current Attrinbute Points', newAp);
    member.send(emb);
  }
  //store playerData
  bot.playerRepo
    .addExp(newExp, newlvl, newAp, player.id)
    .then(() => {
      //update player Collection
      player.exp = newExp;
      player.lvl = newlvl;
      player.ap = newAp;
    })
    .catch(err => console.log(err));
}

export function getLvlBoundry(lvl: number): number {
  return expBasis * (1 + 0.5 * (lvl - 1));
}
