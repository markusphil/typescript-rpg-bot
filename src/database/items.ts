import { isWeapon } from './../dataTypes/typeGuards';
import { DaoInterface } from './dao';
import { item, items } from '../dataTypes/interfaces';

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

  createWeaponTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS weapons (
          id INTEGER PRIMARY KEY,
          itemId INTEGER,
          weaponType STRING,
          baseDMG INTEGER,
          CONSTRAINT weapons_fk_item FOREIGN KEY (itemId)
          REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE
          )`;

    return this.dao.run(sql);
  }

  add(item: item) {
    // add item data
    this.dao.run(
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
    if (isWeapon(item)) {
      // typeguard to make sure weapon data exists
      this.dao.run(
        `INSERT INTO weapons (
        itemId,
        weaponType,
        baseDMG
         )
      VALUES (?, ?, ?)`,
        [item.id, item.weaponType, item.baseDMG]
      );
    }
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
