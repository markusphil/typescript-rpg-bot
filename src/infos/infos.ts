import { racesInfo, singleRaceInfo } from './races';
import { command } from '../index';

export const infos: Array<command> = [
  {
    name: 'races',
    description: 'list all available races',
    execute: racesInfo,
  },
  {
    name: 'race',
    usage: '<?racename> if no racename is choosen, returns a random race',
    description: 'provides info about a specific race',
    execute: singleRaceInfo,
  },
];
