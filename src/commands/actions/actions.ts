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
];
