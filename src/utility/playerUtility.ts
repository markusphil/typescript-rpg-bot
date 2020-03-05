import { player, weapon } from './../dataTypes/interfaces';
import { User } from 'discord.js';
import { bot } from '..';

export function getPlayer(member: User): player {
  const player = bot.players.get(member.id);
  if (!player) throw new Error('Player not Found!');
  return player;
}

export async function getPlayerWeapon(playerId: number): Promise<weapon | undefined> {
  return bot.playerRepo.getPlayerWeapon(playerId);
}
