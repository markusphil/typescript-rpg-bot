import { enemy, items, lootList, enemyData } from './../dataTypes/interfaces';
import { DaoInterface } from './dao';
import { enemies, enemyType } from '../dataTypes/interfaces';

// TODO: asign creatures to habitats
export class EnemyRepo {
  dao: DaoInterface;
  constructor(dao: DaoInterface) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS enemies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          description TEXT,
          str INTEGER,
          dex INTEGER,
          int INTEGER,
          lck INTEGER,
          strMultiplier FLOAT,
          dexMultiplier FLOAT,
          intMultiplier FLOAT,
          lckMultiplier FLOAT)`;

    return this.dao.run(sql);
  }

  add(enemy: enemyData) {
    return this.dao.run(
      `INSERT INTO enemies (
        name,
        description,
        str,
        dex,
        int,
        lck,
        strMultiplier,
        dexMultiplier,
        intMultiplier,
        lckMultiplier
         )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        enemy.name,
        enemy.description,
        enemy.str,
        enemy.dex,
        enemy.int,
        enemy.lck,
        enemy.strMultiplier,
        enemy.dexMultiplier,
        enemy.intMultiplier,
        enemy.lckMultiplier,
      ]
    );
  }

  getById(id: number): Promise<enemyType> {
    return this.dao.get(`SELECT * FROM enemies WHERE id = ?`, [id]);
  }

  getAll(): Promise<enemies> {
    return this.dao.all(`SELECT * FROM enemies`);
  }

  deleteAll() {
    console.warn('deleting all races');
    return this.dao.run(`DELETE FROM races`);
  }

  createLootTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS loot (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          enemyId INTEGER,
          itemId INTEGER,
          chance FLOAT,
          CONSTRAINT inventory_fk_enemyId FOREIGN KEY (enemyId)
          REFERENCES enemies(id) ON UPDATE CASCADE ON DELETE CASCADE
          CONSTRAINT inventory_fk_itemId FOREIGN KEY (itemId)
          REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE
          )`;
    return this.dao.run(sql);
  }

  fillLootTable(enemyId: number, itemId: number, chance: number): Promise<any> {
    if (chance > 1 || chance < 0) {
      throw new Error('chance must be between 0 and 1');
    }
    return this.dao.run(
      ` INSERT INTO loot (enemyId, itemId, chance)
        VALUES (?, ?, ?)`,
      [enemyId, itemId, chance]
    );
  }

  getEnemyLoot(enemyId: number): Promise<lootList> {
    return this.dao.all(
      `SELECT
      L.enemyId,
      L.itemId,
      L.chance,
      I.name AS itemName
      FROM [loot] L
      JOIN items I ON L.itemId = I.id
      WHERE enemyId = ?`,
      [enemyId]
    );
  }
}
