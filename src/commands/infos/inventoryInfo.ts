import { inventoryItem, inventoryItems } from './../../dataTypes/interfaces';
import { RichEmbed } from 'discord.js';
import { bot } from '../../index';
import { infoColor } from '../../config.json';
import { commandExecute } from '../../dataTypes/interfaces';
import { getPlayer } from '../../utility/playerUtility';

export const inventoryInfo: commandExecute = async (args, message) => {
  let embed = new RichEmbed().setColor(infoColor).setTitle('Your Inventory');
  const player = getPlayer(message.author);
  const inventory = await getInventoryItems(player.id);
  inventory.forEach(i => {
    embed.addField(
      i.amount + 'x' + i.name,
      `${i.type} \n ${i.description} \n value: ${i.value} / total: ${i.value * i.amount} `
    );
  });
  message.author.send(embed);
};

async function getInventoryItems(playerId: number): Promise<inventoryItems> {
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
