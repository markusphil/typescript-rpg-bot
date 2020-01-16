import { player } from './../dataTypes/interfaces';
import { bot } from '..';
import { inventoryItems, inventoryItem } from '../dataTypes/interfaces';

export async function getPlayersInventory(playerId: number): Promise<inventoryItems> {
  const itemList = await bot.playerRepo.getPlayerInventory(playerId);
  console.log(itemList);
  // count duplicates
  let itemIds: number[] = [];
  let inventoryItemList: inventoryItems = [];
  itemList.forEach(i => {
    if (!itemIds.includes(i.id)) {
      itemIds.push(i.id);
      inventoryItemList.push({ ...i, amount: 1 });
    } else {
      const iItem: inventoryItem | undefined = inventoryItemList.find(ii => ii.id === i.id);
      if (iItem) {
        iItem.amount++;
      }
    }
  });
  return inventoryItemList;
}

export async function sellItemAll(player: player, itm: inventoryItem) {
  bot.playerRepo.inventoryRemove(player.id, itm.id);
  const newCoinCount = player.coins + itm.value * itm.amount;
  await bot.playerRepo.setGold(newCoinCount, player.id);
  player.coins = newCoinCount;
}
