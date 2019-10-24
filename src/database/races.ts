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
          description TEXT,
          message Text
          )
          `;
    return this.dao.run(sql);
  }

  add(name: string, description: string, message: string) {
    return this.dao.run('INSERT INTO races (name, description, message) VALUES (?, ?, ?)', [
      name,
      description,
      message,
    ]);
  }

  getAll(): Promise<races> {
    return this.dao.all(`SELECT * FROM races`);
  }

  deleteAll() {
    console.warn('deleting all entries');
    return this.dao.run(`DELETE FROM races`);
  }
}
export interface races extends Array<race> {}

export interface race {
  id: number;
  name: string;
  description: string;
  message: string;
}
