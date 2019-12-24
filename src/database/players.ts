import { modifier } from './modifiers';
import { race } from './races';
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
    INSERT OR IGNORE INTO players (name, discordId, raceId, modId, str, dex , int, lck)
    SELECT ? , ? , ? , ?,
      R.base_str + M.bonus_str - M.malus_str AS str,
      R.base_dex + M.bonus_dex - M.malus_dex AS dex,
      R.base_int + M.bonus_int - M.malus_int AS int,
      R.base_lck + M.bonus_lck - M.malus_lck AS lck
    FROM [races] R , [modifiers] M
      WHERE R.id = ? AND M.id = ?`,
      [name, discordId, raceId, modId, raceId, modId]
    );
  }

  getAll(): Promise<players> {
    return this.dao.all(
      `SELECT P.id, P.name, P.discordId, P.raceId, P.modId, P.str, P.dex , P.int, P.lck, R.name_s AS race, M.name AS modifier
      FROM [players] P
      JOIN races R ON P.raceId = R.id
      JOIN modifiers M ON P.modId = M.id`
    );
  }
  getById(discordId: string): Promise<player> {
    return this.dao.get(
      `SELECT P.id, P.name, P.discordId, P.raceId, P.modId, P.str, P.dex, P.int, P.lck, R.name_s AS race, M.name AS modifier
      FROM[players] P
      JOIN races R ON P.raceId = R.id
      JOIN modifiers M ON P.modId = M.id
      WHERE discordId = ?`,
      [discordId]
    );
  }

  deleteAll() {
    console.warn('deleting all entries');
    return this.dao.run(`DELETE FROM players`);
  }
}
export interface players extends Array<player> {}

export interface player {
  id: number;
  name: string;
  discordId: string;
  raceId: number;
  race: string;
  modId: number;
  modifier: string;
  str: number;
  dex: number;
  int: number;
  lck: number;
  hp?: number;
}
