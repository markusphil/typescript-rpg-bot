import { RichEmbed } from 'discord.js';
import { infoColor } from '../../config.json';
import { commandExecute } from '../../dataTypes/interfaces';
import { getPlayer } from '../../utility/playerUtility';
import { getPlayersInventory } from '../../mechanics/inventory';

export const inventoryInfo: commandExecute = async (args, message) => {
  let embed = new RichEmbed().setColor(infoColor).setTitle('Your Inventory');
  const player = getPlayer(message.author);
  const inventory = await getPlayersInventory(player.id);
  inventory.forEach(i => {
    embed.addField(
      i.amount + 'x' + i.name,
      `${i.type} \n ${i.description} \n value: ${i.value} / total: ${i.value * i.amount} `
    );
  });
  message.author.send(embed);
};
