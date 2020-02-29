import { items, enemies, players } from './../dataTypes/interfaces';
import { ItemRepo } from './items';
import { AppDAO } from './dao';
import { RaceRepo } from './races';
import { ModifierRepo } from './modifiers';
import { PlayerRepo } from './players';
import { EnemyRepo } from './enemies';

import raceData from './raceData.json';
import modifierData from './modifierData.json';
import enemyData from './enemyData.json';
import itemData from './itemData.json';

import { unlinkSync } from 'fs';
import { resolve } from 'dns';
import { isValidItemType, hasValidItemType } from '../dataTypes/typeGuards';
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
  const enemies = new EnemyRepo(dao);
  const items = new ItemRepo(dao);

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
        return players.createInventory();
      })
      .then(() => {
        console.log('created inventory table');
        return players.createPlayerWeapon();
      })
      .then(() => {
        console.log('created player weapon Table');
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

  const setupEnemies = new Promise((resolve, reject) => {
    enemies
      .createTable()
      .then(() => {
        return Promise.all(
          enemyData.map(en => {
            return enemies.add(en);
          })
        );
      })
      .then(() => {
        console.log('set up enemies');
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });

  const setupItems = new Promise((resolve, reject) => {
    items
      .createTable()
      .then(() => {
        console.log('created ItemTable');
        return items.createWeaponTable();
      })
      .then(() => {
        console.log('created Weapontable');
        return Promise.all(
          itemData.map(item => {
            if (!hasValidItemType(item)) {
              throw Error(item.type + ' is no valid itemType!');
            }
            // check type!
            return items.add(item);
          })
        );
      })
      .then(() => {
        console.log('set up items');
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });

  const setupLoot = new Promise((resolve, reject) => {
    enemies
      .createLootTable()
      .then(() => {
        let lootPromises: Array<Promise<any>> = [];
        enemyData.forEach((en, id) => {
          en.loot.forEach(itm => {
            lootPromises.push(enemies.fillLootTable(id + 1, itm.id, itm.chance));
          });
        });
        return Promise.all(lootPromises);
      })
      .then(() => {
        console.log('set up enemyLoot');
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });

  Promise.all([setupRaces, setupPlayers, setupModifiers, setupEnemies, setupItems, setupLoot])
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
