import sqlite3 from 'sqlite3';

export class AppDAO implements DaoInterface {
  db: sqlite3.Database;

  constructor(dbFilePath: string) {
    this.db = new sqlite3.Database(dbFilePath, err => {
      if (err) {
        console.log('Could not connect to database', err);
      } else {
        console.log('Connected to database');
      }
    });
  }

  run(sql: string, params: string[] = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, err => {
        if (err) {
          console.log('Error running sql ' + sql);
          console.log(err);
          reject(err);
        } else {
          resolve({ message: 'success' });
        }
      });
    });
  }

  get(sql: string, params: string[] = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log('Error running sql: ' + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  all(sql: string, params: string[] = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log('Error running sql: ' + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

export interface DaoInterface {
  db: sqlite3.Database;
  run(sql: string, params?: string[]): Promise<any>;
  get(sql: string, params?: string[]): Promise<any>;
  all(sql: string, params?: string[]): Promise<any>;
}
