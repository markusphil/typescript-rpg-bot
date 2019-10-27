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
          message Text
          )
          `;
    return this.dao.run(sql);
  }

  add(name: string, name_s: string, description: string, message: string) {
    return this.dao.run('INSERT INTO races (name, name_s, description, message) VALUES (?, ?, ?, ?)', [
      name,
      name_s,
      description,
      message,
    ]);
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
export interface races extends Array<race> {}

export interface race {
  id: number;
  name: string;
  name_lc?: string;
  name_s: string;
  description: string;
  message: string;
}
