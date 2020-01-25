import { DaoInterface } from './dao';
import { item, items } from '../dataTypes/interfaces';

// TODO: define ids in json data to have control over them!

export class ItemRepo {
  dao: DaoInterface;
  constructor(dao: DaoInterface) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY,
          name TEXT,
          description TEXT,
          value INTEGER,
          type STRING
          )`;

    return this.dao.run(sql);
  }

  add(item: item) {
    return this.dao.run(
      `INSERT INTO items (
        id,
        name,
        description,
        value,
        type
         )
      VALUES (?, ?, ?, ?, ?)`,
      [item.id, item.name, item.description, item.value, item.type]
    );
  }

  getById(id: number): Promise<item> {
    return this.dao.get(`SELECT * FROM items WHERE id = ?`, [id]);
  }

  getAll(): Promise<items> {
    return this.dao.all(`SELECT * FROM items`);
  }

  deleteAll() {
    console.warn('deleting all items');
    return this.dao.run(`DELETE FROM items`);
  }
}
