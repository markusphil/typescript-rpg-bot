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
          str INTEGER,
          dex INTEGER,
          int INTEGER,
          lck INTEGER,
          CONSTRAINT player_fk_raceId FOREIGN KEY (raceId)
          REFERENCES race(id) ON UPDATE CASCADE ON DELETE CASCADE
          UNIQUE (discordId))`;

    return this.dao.run(sql);
  }

  add(name: string, discordId: string, raceId: number) {
    // silent ignores might not be the best solution since I want to show a message only if a new player was added
    return this.dao.run(
      `
    INSERT OR IGNORE INTO players (name, discordId, raceId, str, dex , int, lck)
    SELECT ? , ? , ? , R.base_str AS str, R.base_dex AS dex, R.base_int AS int, R.base_lck AS lck
    FROM [races] R
    WHERE R.id = ?`,
      [name, discordId, raceId, raceId]
    );
  }

  getAll(): Promise<players> {
    return this.dao.all(
      `SELECT P.id, P.name, P.discordId, P.raceId, P.str, P.dex , P.int, P.lck, R.name_s AS race
      FROM [players] P
      JOIN races R ON P.raceId = R.id`
    );
  }
  getById(discordId: string): Promise<player> {
    return this.dao.get(
      `SELECT P.id, P.name, P.discordId, P.raceId, R.name_s AS race
      FROM [players] P
      JOIN races R ON P.raceId = R.id
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
  str: number;
  dex: number;
  int: number;
  lck: number;
}
