import { modifier, modifiers } from './../dataTypes/interfaces';
import { DaoInterface } from './dao';

export class ModifierRepo {
  dao: DaoInterface;
  constructor(dao: DaoInterface) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS modifiers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          message Text,
          bonus_str INTEGER,
          bonus_dex INTEGER,
          bonus_int INTEGER,
          bonus_lck INTEGER,
          malus_str INTEGER,
          malus_dex INTEGER,
          malus_int INTEGER,
          malus_lck INTEGER
          )
          `;
    return this.dao.run(sql);
  }

  add(
    name: string,
    message: string,
    bonus_str: number,
    bonus_dex: number,
    bonus_int: number,
    bonus_lck: number,
    malus_str: number,
    malus_dex: number,
    malus_int: number,
    malus_lck: number
  ) {
    return this.dao.run(
      `INSERT INTO modifiers(
        name,
        message,
        bonus_str ,
        bonus_dex,
        bonus_int,
        bonus_lck,
        malus_str,
        malus_dex,
        malus_int,
        malus_lck
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, message, bonus_str, bonus_dex, bonus_int, bonus_lck, malus_str, malus_dex, malus_int, malus_lck]
    );
  }

  getById(id: number): Promise<modifier> {
    return this.dao.get(`SELECT * FROM modifiers WHERE id = ?`, [id]);
  }

  getAll(): Promise<modifiers> {
    return this.dao.all(`SELECT * FROM modifiers`);
  }

  deleteAll() {
    console.warn('deleting all modifiers');
    return this.dao.run(`DELETE FROM modifiers`);
  }
}
