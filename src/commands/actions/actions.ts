import { equipWeaponfromInventory } from './equipment';
import { getStarterWeapon } from './startEquipment';
import { handleSaleRequest } from './trade';
import { improveAttributes } from './attributes';
import { joinByCommand } from './account';
import { command } from '../../dataTypes/interfaces';
import { goHunting } from './hunt';

export const actions: Array<command> = [
  {
    name: 'join',
    aliases: ['register', 'signup'],
    description: 'register player if not exists',
    execute: joinByCommand,
    guildOnly: true,
  },
  {
    name: 'hunt',
    aliases: ['hunting', 'gohunting'],
    description: 'go hunting to find loot and exp',
    execute: goHunting,
  },
  {
    name: 'train',
    aliases: ['lvlup', '+'],
    usage: '<?str> <?dex> <?int> <?lck>',
    description: 'use your AP to increase attributes',
    execute: improveAttributes,
  },
  {
    name: 'sell',
    usage: '<"all" or "loot"> or <?itemName>',
    description: `Sell items from your inventory.
    (type "all" to sell all items / "loot" for all items of type loot / or a list of specific items)`,
    execute: handleSaleRequest,
  },
  {
    name: 'starterweapon',
    aliases: ['staters', 'sw'],
    usage: '<"bow" or "sword">',
    description: 'choose and receive your starting weapon!',
    execute: getStarterWeapon,
  },
  {
    name: 'equip',
    aliases: ['useweapon'],
    usage: '<weaponName>',
    description: 'equip a weapon from your inventory',
    execute: equipWeaponfromInventory,
  },
];
