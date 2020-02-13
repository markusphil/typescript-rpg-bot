import { commandExecute } from '../../dataTypes/interfaces';
import { getPlayer } from '../../utility/playerUtility';
import { sendError } from '../../utility/error';
import { getPlayersInventory } from '../../mechanics/inventory';
import { bot } from '../..';
import { User, RichEmbed } from 'discord.js';
import { successColor } from '../../config.json';

export const getStarterWeapon: commandExecute = async (args, message) => {
  if (args.length != 1 || args[0].length < 1) {
    sendError(`you need to decide between SWORD and BOW! \n Type: starter <sword | bow>`, message);
    return;
  }
  try {
    const player = getPlayer(message.author);
    const inventory = await getPlayersInventory(player.id);

    if (inventory.some(itm => itm.id === 4 || itm.id === 5)) {
      sendError('You only can have one starter Weapon', message);
      return;
    }

    switch (args[0]) {
      case 'bow':
        addWeapon(player.id, 4, message.author);
        break;
      case 'sword':
        addWeapon(player.id, 5, message.author);
        break;
      default:
        sendError("Only 'sword' and 'bow' are valid starter weapons", message);
    }
  } catch (err) {
    sendError(err);
  }
};

function addWeapon(playerId: number, weaponId: number, author: User) {
  bot.playerRepo
    .inventoryAdd(playerId, weaponId)
    .then(() => {
      return bot.itemRepo.getById(weaponId);
    })
    .then(itm => {
      const embed = new RichEmbed()
        .setColor(successColor)
        .setTitle('Recieved Starter Weapon')
        .setDescription(`You received an old ${itm.name}`);
      author.send(embed);
    })
    .catch(err => console.log(err));
}
