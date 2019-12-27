import { race, races } from './../dataTypes/interfaces';
import { DaoInterface } from './dao';

export class RaceRepo {
  dao: DaoInterface;
  constructor(dao: DaoInterface) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS races (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          name_s TEXT,
          description TEXT,
          message Text,
          base_str INTEGER,
          base_dex INTEGER,
          base_int INTEGER,
          base_lck INTEGER
          )
          `;
    return this.dao.run(sql);
  }

  add(
    name: string,
    name_s: string,
    description: string,
    message: string,
    strength: number,
    dexterity: number,
    intelligence: number,
    luck: number
  ) {
    return this.dao.run(
      'INSERT INTO races (name, name_s, description, message, base_str, base_dex, base_int, base_lck) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, name_s, description, message, strength, dexterity, intelligence, luck]
    );
  }

  getById(id: number): Promise<race> {
    return this.dao.get(`SELECT * FROM races WHERE id = ?`, [id]);
  }

  getAll(): Promise<races> {
    return this.dao.all(`SELECT * FROM races`);
  }

  deleteAll() {
    console.warn('deleting all races');
    return this.dao.run(`DELETE FROM races`);
  }
}
