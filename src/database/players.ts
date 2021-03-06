import { player, players, items, weapon } from './../dataTypes/interfaces';
import { DaoInterface } from './dao';

export class PlayerRepo {
  dao: DaoInterface;
  constructor(dao: DaoInterface) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS players (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          discordId TEXT,
          raceId INTEGER,
          modId INTEGER,
          str INTEGER,
          dex INTEGER,
          int INTEGER,
          lck INTEGER,
          exp INTEGER,
          lvl INTEGER,
          ap INTEGER,
          coins INTEGER,
          CONSTRAINT player_fk_raceId FOREIGN KEY (raceId)
          REFERENCES race(id) ON UPDATE CASCADE ON DELETE CASCADE
          CONSTRAINT player_fk_modId FOREIGN KEY (modId)
          REFERENCES modifiers(id) ON UPDATE CASCADE ON DELETE CASCADE
          UNIQUE (discordId))`;

    return this.dao.run(sql);
  }

  add(name: string, discordId: string, raceId: number, modId: number) {
    // add calculation for attributes based on race an modifiers
    return this.dao.run(
      `
    INSERT OR IGNORE INTO players (name, discordId, raceId, modId, exp, lvl, ap, coins, str, dex , int, lck)
    SELECT ? , ? , ? , ? , ? , ? , ? , ? ,
      R.base_str + M.bonus_str - M.malus_str AS str,
      R.base_dex + M.bonus_dex - M.malus_dex AS dex,
      R.base_int + M.bonus_int - M.malus_int AS int,
      R.base_lck + M.bonus_lck - M.malus_lck AS lck
    FROM [races] R , [modifiers] M
      WHERE R.id = ? AND M.id = ?`,
      [name, discordId, raceId, modId, 0, 1, 0, 0, raceId, modId]
    );
  }

  getAll(): Promise<players> {
    return this.dao.all(
      `SELECT 
      P.id,
      P.name,
      P.discordId,
      P.raceId,
      P.modId,
      P.str,
      P.dex,
      P.int,
      P.lck,
      P.exp,
      P.lvl,
      P.ap,
      P.coins,
      R.name_s AS race,
      M.name AS modifier
      FROM [players] P
      JOIN races R ON P.raceId = R.id
      JOIN modifiers M ON P.modId = M.id`
    );
  }
  getById(discordId: string): Promise<player> {
    return this.dao.get(
      `SELECT
      P.id,
      P.name,
      P.discordId,
      P.raceId,
      P.modId,
      P.str,
      P.dex,
      P.int,
      P.lck,
      P.exp,
      P.lvl,
      P.ap,
      P.coins,
      R.name_s AS race,
      M.name AS modifier
      FROM[players] P
      JOIN races R ON P.raceId = R.id
      JOIN modifiers M ON P.modId = M.id
      WHERE discordId = ?`,
      [discordId]
    );
  }

  addExp(exp: number, lvl: number, ap: number, playerId: number): Promise<any> {
    return this.dao.run(
      `
      UPDATE players
      SET exp = ?,
          lvl = ?,
          ap = ?
      WHERE id = ?
    `,
      [exp, lvl, ap, playerId]
    );
  }

  addAttributes(str: number, dex: number, int: number, lck: number, ap: number, playerId: number): Promise<any> {
    return this.dao.run(
      `
      UPDATE players
      SET str = ?,
          dex = ?,
          int = ?,
          lck = ?,
          ap = ?
      WHERE id = ?
    `,
      [str, dex, int, lck, ap, playerId]
    );
  }

  setGold(newCoinCount: number, playerId: number) {
    return this.dao.run(
      `
    UPDATE players
      SET coins = ?
      WHERE id = ?
    `,
      [newCoinCount, playerId]
    );
  }

  deleteAll() {
    console.warn('deleting all entries');
    return this.dao.run(`DELETE FROM players`);
  }

  // Player Inventory
  createInventory() {
    const sql = `
        CREATE TABLE IF NOT EXISTS inventory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          playerId INTEGER,
          itemId INTEGER,
          CONSTRAINT inventory_fk_playerId FOREIGN KEY (playerId)
          REFERENCES player(id) ON UPDATE CASCADE ON DELETE CASCADE
          CONSTRAINT inventory_fk_itemId FOREIGN KEY (itemId)
          REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE
          )`;
    return this.dao.run(sql);
  }

  inventoryAdd(playerId: number, itemId: number) {
    return this.dao.run(
      `
        INSERT INTO inventory (playerId, itemId)
        VALUES (?, ?)`,
      [playerId, itemId]
    );
  }

  inventoryRemove(playerId: number, itemId: number) {
    return this.dao.run(
      `
        DELETE FROM inventory
        WHERE playerId = ? AND itemId = ?
      `,
      [playerId, itemId]
    );
  }

  getPlayerInventory(playerId: number): Promise<items> {
    return this.dao.all(
      ` SELECT
        X.itemId as id,
        I.name,
        I.description,
        I.type,
        I.value
        FROM [inventory] X
        JOIN items I ON X.itemId = I.id
        JOIN weapons
        WHERE playerId = ?`,
      [playerId]
    );
  }

  getPlayerItem(playerId: number, itemId: number): Promise<items> {
    return this.dao.all(
      `
        SELECT
        X.itemId as id,
        I.name,
        I.description,
        I.type,
        I.value
        FROM [inventory] X
        JOIN items I ON X.itemId = I.id
        WHERE playerId = ? AND itemId = ?
      `,
      [playerId, itemId]
    );
  }

  // player Weapon
  createPlayerWeapon() {
    const sql = `
        CREATE TABLE IF NOT EXISTS playerweapon (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          playerId INTEGER,
          itemId INTEGER,
          CONSTRAINT playerweapon_fk_playerId FOREIGN KEY (playerId)
          REFERENCES player(id) ON UPDATE CASCADE ON DELETE CASCADE
          CONSTRAINT playerweapon_fk_itemId FOREIGN KEY (itemId)
          REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE
          )`;
    return this.dao.run(sql);
  }

  playerWeaponAdd(playerId: number, itemId: number) {
    return this.dao.run(
      `
        INSERT INTO playerweapon (playerId, itemId)
        VALUES (?, ?)`,
      [playerId, itemId]
    );
  }

  playerWeaponRemove(playerId: number, itemId: number) {
    return this.dao.run(
      `
        DELETE FROM playerweapon
        WHERE playerId = ? AND itemId = ?
      `,
      [playerId, itemId]
    );
  }

  getPlayerWeapon(playerId: number): Promise<weapon> {
    return this.dao.get(
      ` SELECT
        X.itemId as id,
        I.name,
        I.description,
        I.type,
        I.value,
        W.weaponType,
        W.baseDMG
        FROM [playerweapon] X
        JOIN items I ON X.itemId = I.id
        JOIN weapons W ON X.itemId = W.itemId
        WHERE playerId = ?`,
      [playerId]
    );
  }
}
