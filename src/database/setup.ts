import { PlayerRepo } from './players';
import { AppDAO } from './dao';
import { RaceRepo } from './races';

import raceData from './raceData.json';

function setup() {
  const dao = new AppDAO('./database.sqlite3');
  const races = new RaceRepo(dao);
  const players = new PlayerRepo(dao);

  races
    .createTable()
    .then(() => {
      return races.deleteAll();
    })
    .then(() => {
      return Promise.all(
        raceData.map(race => {
          return races.add(
            race.name,
            race.name_s,
            race.description,
            race.message,
            race.strength,
            race.dexterity,
            race.intelligence,
            race.luck
          );
        })
      );
    })
    .then(() => console.log('set up races'));

  players.createTable().then(() => console.log('created player Table'));
}

setup();
