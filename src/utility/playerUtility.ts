import { player } from '../dataTypes/interfaces';
import { User } from 'discord.js';
import { bot } from '..';

export function getPlayer(member: User): player {
  const player = bot.players.get(member.id);
  if (!player) throw new Error('Player not Found!');
  return player;
}
