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

  add(enemy: enemy) {
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
        enemy.strength,
        enemy.dexterity,
        enemy.intelligence,
        enemy.luck,
        enemy.strMultiplier,
        enemy.dexMultiplier,
        enemy.intMultiplier,
        enemy.lckMultiplier,
      ]
    );
  }

  getById(id: number): Promise<enemy> {
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
export interface enemies extends Array<enemy> {}

export interface enemy {
  id?: number;
  name: string;
  description: string;
  strength: number;
  dexterity: number;
  intelligence: number;
  luck: number;
  strMultiplier: number;
  dexMultiplier: number;
  intMultiplier: number;
  lckMultiplier: number;
}
