import { RichEmbed } from 'discord.js';
import { infoColor } from '../../config.json';
import { commandExecute } from '../../dataTypes/interfaces';
import { getPlayer, getPlayerWeapon } from '../../utility/playerUtility';
import { getPlayersInventory } from '../../mechanics/inventory';

export const equipmentInfo: commandExecute = async (args, message) => {
  let embed = new RichEmbed().setColor(infoColor).setTitle('Your Equipment:');
  const player = getPlayer(message.author);
  const weapon = await getPlayerWeapon(player.id);
  if (weapon) {
    embed.addField(
      weapon.name,
      `Type: ${weapon.type} \n DMG: ${weapon.baseDMG} \n ${weapon.description} \n value: ${weapon.value}`
    );
  }
  // TODO: add armor and accesory once implemented

  if (!embed.fields || embed.fields.length === 0) {
    embed.addField('Ups', 'you currently have no equipment');
  }
  message.author.send(embed);
};
