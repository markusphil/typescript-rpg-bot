import { commandExecute } from '../../../dataTypes/interfaces';
import { getPlayer } from '../../../utility/playerUtility';
import { sendError } from '../../../utility/error';
import { getPlayersInventory } from '../../../mechanics/inventory';
import { bot } from '../../..';
import { RichEmbed } from 'discord.js';
import { successColor } from '../../../config.json';
import { equipWeapon } from '../../../mechanics/equipment';

export const equipWeaponfromInventory: commandExecute = async (args, message) => {
  // if args contain multiple words, combine them:
  if (args.length < 1) {
    sendError('You need to provide the weapons name', message);
    return;
  }
  const weaponName = args.join(' ').toLowerCase();
  // find weapon ID
  const weapon = await bot.itemRepo.getByName(weaponName);
  if (!weapon) {
    sendError('There is no Item called ' + weaponName, message);
    return;
  } else if (weapon.type !== 'weapon') {
    sendError(weaponName + ' is not a weapon', message);
    return;
  }

  // get player inventory
  const player = getPlayer(message.author);
  const inventory = await getPlayersInventory(player.id);
  // check if weapon is in inventory => throw error if not
  if (!inventory.some(itm => itm.id === weapon.id)) {
    sendError('There is no ' + weaponName + ' in your inventory', message);
    return;
  }
  try {
    await equipWeapon(player.id, weapon.id);
    const embed = new RichEmbed().setColor(successColor).setTitle('Equiped ' + weaponName);
    message.author.send(embed);
  } catch (err) {
    sendError(err, message);
  }
};
