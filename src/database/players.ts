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
          CONSTRAINT player_fk_raceId FOREIGN KEY (raceId)
          REFERENCES race(id) ON UPDATE CASCADE ON DELETE CASCADE
          UNIQUE (discordId))`;

    return this.dao.run(sql);
  }

  add(name: string, discordId: string, raceId: number) {
    console.log(discordId);
    // silent ignores might not be the best solution since I want to show a message only if a new player was added
    return this.dao.run('INSERT OR IGNORE INTO players (name, discordId, raceId) VALUES (?, ?, ?)', [
      name,
      discordId,
      raceId,
    ]);
  }

  getAll(): Promise<players> {
    return this.dao.all(
      `SELECT P.id, P.name, P.discordId, P.raceId, R.name_s AS race FROM [players] P JOIN races R ON P.raceId = R.id`
    );
  }
  getById(discordId: string): Promise<player> {
    return this.dao.get(`SELECT * FROM players WHERE discordId = ?`, [discordId]);
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
}
