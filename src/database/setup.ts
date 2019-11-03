import { ModifierRepo } from './modifiers';
import { PlayerRepo } from './players';
import { AppDAO } from './dao';
import { RaceRepo } from './races';

import raceData from './raceData.json';
import modifierData from './modifierData.json';
import { unlinkSync } from 'fs';
// TODO: setup Modifiers
function setup() {
  try {
    unlinkSync('./database.sqlite3');
    console.log('cleared Database');
  } catch (err) {
    console.log(err);
  }

  const dao = new AppDAO('./database.sqlite3');
  const races = new RaceRepo(dao);
  const players = new PlayerRepo(dao);
  const modifiers = new ModifierRepo(dao);

  const setupRaces = new Promise((resolve, reject) => {
    races
      .createTable()
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
      .then(() => {
        console.log('set up races');
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });

  const setupPlayers = new Promise((resolve, reject) => {
    players
      .createTable()
      .then(() => {
        console.log('created player Table');
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });

  const setupModifiers = new Promise((resolve, reject) => {
    modifiers
      .createTable()
      .then(() => {
        return Promise.all(
          modifierData.map(mod => {
            return modifiers.add(
              mod.name,
              mod.message,
              mod.strengthBonus,
              mod.dexterityBonus,
              mod.intelligenceBonus,
              mod.luckBonus,
              mod.strengthMalus,
              mod.dexterityMalus,
              mod.intelligenceMalus,
              mod.luckMalus
            );
          })
        );
      })
      .then(() => {
        console.log('set up modifiers');
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });

  Promise.all([setupRaces, setupPlayers, setupModifiers])
    .then(() => {
      console.log('finished setup');
      process.exit(0);
    })
    .catch(err => {
      console.log(err);
      process.exit(1);
    });
}

setup();
