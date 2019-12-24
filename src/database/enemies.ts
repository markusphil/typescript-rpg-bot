import { modifier } from './modifiers';
import { DaoInterface } from './dao';

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

  add(enemy: enemyType) {
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
}
export interface enemies extends Array<enemyType> {}

export interface enemyType {
  id?: number;
  name: string;
  description: string;
  str: number;
  dex: number;
  int: number;
  lck: number;
  strMultiplier: number;
  dexMultiplier: number;
  intMultiplier: number;
  lckMultiplier: number;
}

export interface enemy {
  name: string;
  description: string;
  modifier: string;
  lvl: number;
  str: number;
  dex: number;
  int: number;
  lck: number;
  hp: number;
}
