import { sendError } from './../../utility/error';
import { RichEmbed, Message } from 'discord.js';
import { successColor } from '../../config.json';

import { getPlayer } from '../../utility/playerUtility';
import { commandExecute, inventoryItems, player } from './../../dataTypes/interfaces';
import { getPlayersInventory, sellItemAll } from '../../mechanics/inventory';

export const handleSaleRequest: commandExecute = async (args, message) => {
  const player = getPlayer(message.author);
  const playerInventory = await getPlayersInventory(player.id);

  if (!playerInventory.length) {
    sendError('There are no items in your inventory', message);
    return;
  }

  let response: RichEmbed | undefined;

  if (args.length < 1) {
    sendError('You need to specify what you want to sell!', message);
    return;
  } else if (args.length === 1) {
    switch (args[0]) {
      case 'loot':
        response = sellAllLoot(player, playerInventory);
        break;
      case 'all':
        response = sellAllInventory(player, playerInventory);
        break;
      default:
        response = await sellItemIfExists(args[0], message, player, playerInventory);
    }
  } else {
    args.forEach(itmName => {
      console.log(itmName);
      sellItemIfExists(itmName, message, player, playerInventory).then(emb => (response = emb));
    });
  }

  if (response) message.author.send(response);
};

function sellAllInventory(p: player, playerInventory: inventoryItems): RichEmbed {
  const embed = new RichEmbed().setColor(successColor).setTitle('Sold All Items');
  const soldItems = sellItemList(p, playerInventory);
  embed.setDescription(soldItems.join(',\n'));
  return embed;
}
function sellAllLoot(p: player, playerInventory: inventoryItems): RichEmbed {
  const embed = new RichEmbed().setColor(successColor).setTitle('Sold All items of type "loot"');
  const lootItems = playerInventory.filter(itm => itm.type === 'loot');
  const soldItems = sellItemList(p, lootItems);
  embed.setDescription(soldItems.join(',\n'));
  return embed;
}

function sellItemList(pl: player, inventoryItemList: inventoryItems): string[] {
  let soldItems: string[] = [];
  inventoryItemList.forEach(itm => {
    sellItemAll(pl, itm);
    soldItems.push(`${itm.amount} x ${itm.name} for ${itm.value * itm.amount} coins `);
  });
  return soldItems;
}

async function sellItemIfExists(
  itemName: string,
  m: Message,
  p: player,
  playerInventory: inventoryItems
): Promise<RichEmbed | undefined> {
  // check if item exists in player inventory
  const itm = playerInventory.find(invItm => invItm.name === itemName);
  if (!itm) {
    sendError(`There is no ${itemName} in your Inventory`, m);
    return;
  } else {
    const embed = new RichEmbed().setColor(successColor).setTitle('Sold Item:');
    await sellItemAll(p, itm);
    embed.setDescription(`${itm.amount} x ${itm.name} for ${itm.value * itm.amount} coins `);
    return embed;
  }
}
