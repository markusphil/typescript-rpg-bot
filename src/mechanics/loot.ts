import { bot } from '..';
import { fighter, lootList } from '../dataTypes/interfaces';

export async function addPlayerLoot(player: fighter, enemy: fighter): Promise<string> {
  // placeholder function to test if item table works
  /*  await bot.playerRepo.inventoryAdd(player.id, 1);
  return 'fur'; */
  // get loot table from enemy
  const lootArray = await bot.enemyRepo.getEnemyLoot(enemy.id);
  console.log(lootArray);
  // calculate chances
  let receivedLoot: lootList = [];
  lootArray.forEach(lo => {
    if (1 - lo.chance > Math.random()) {
      receivedLoot.push(lo);
    }
  });
  let lootNames: string[] = [];
  // add items to inventory
  return Promise.all(
    receivedLoot.map(lo => {
      lootNames.push(lo.itemName);
      return bot.playerRepo.inventoryAdd(player.id, lo.itemId);
    })
  ).then(() => {
    // return message
    return lootNames.join(', ');
  });
}
