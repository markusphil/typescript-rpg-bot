import { modifierInfo } from './modifierInfo';
import { playerInfo, activePlayerInfo } from './playerInfo';
import { actionsInfo, helpInfo } from './commands';
import { racesInfo, singleRaceInfo } from './raceInfo';
import { command } from '../index';

export const infos: Array<command> = [
  {
    name: 'races',
    description: 'lists all available races',
    execute: racesInfo,
  },
  {
    name: 'race',
    usage: '<?racename>',
    description: 'provides info about a specific race. If no racename is set, returns a random race info',
    execute: singleRaceInfo,
  },
  {
    name: 'actions',
    description: 'lists all available action commands',
    execute: actionsInfo,
  },
  {
    name: 'help',
    aliases: ['info', '?'],
    description: 'lists all available info commands',
    execute: helpInfo,
  },
  {
    name: 'players',
    description: 'lists all registered players',
    execute: playerInfo,
  },
  {
    name: 'modifiers',
    description: 'lists all existing modifierss',
    execute: modifierInfo,
  },
  {
    name: 'status',
    aliases: ['me', 'stats'],
    description: 'displays your current stats',
    execute: activePlayerInfo,
  },
];
