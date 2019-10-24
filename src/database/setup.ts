import { AppDAO } from './dao';
import { RaceRepo } from './races';

import raceData from './raceData.json';

function setup() {
  const dao = new AppDAO('../../database.sqlite3');
  const races = new RaceRepo(dao);
  races
    .createTable()
    .then(() => {
      return races.deleteAll();
    })
    .then(() => {
      return Promise.all(
        raceData.map(race => {
          return races.add(race.name, race.description, race.message);
        })
      );
    })
    .then(() => console.log('set up races'));
}

setup();
