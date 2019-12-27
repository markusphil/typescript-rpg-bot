import { User } from 'discord.js';
import { bot } from '..';
import { getPlayer } from '../utility/playerUtility';

export async function addPlayerLoot(member: User): Promise<string> {
  const player = getPlayer(member);
  // placeholder function to test if item table works
  await bot.playerRepo.inventoryAdd(player.id, 1);
  return 'fur';
}
