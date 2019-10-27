import { joinByCommand } from './account';
import { command } from './../index';

export const actions: Array<command> = [
  {
    name: 'join',
    aliases: ['register', 'signup'],
    description: 'register player if not exists',
    execute: joinByCommand,
    guildOnly: true,
  },
];
