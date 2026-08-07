import * as SQLite from 'expo-sqlite';

export const isWeb = false;
const WEB_DB_KEY = 'MEMORA_WEB_DB_FILES'; // Kept for interface parity

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  // Native SQLite initialization
  db = await SQLite.openDatabaseAsync('memoraai.db');
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS Files (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      uri TEXT NOT NULL UNIQUE,
      size INTEGER NOT NULL,
      extension TEXT,
      mimeType TEXT,
      lastModified INTEGER,
      category TEXT NOT NULL,
      purpose TEXT DEFAULT 'Unknown',
      importance TEXT DEFAULT 'Low',
      tags TEXT DEFAULT '[]',
      confidence INTEGER DEFAULT 0,
      hash TEXT,
      isDuplicate INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL
    );
  `);

  const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(Files)');
  const columnNames = new Set(columns.map((column) => column.name));

  const migrations = [
    { name: 'purpose', sql: `ALTER TABLE Files ADD COLUMN purpose TEXT DEFAULT 'Unknown'` },
    { name: 'importance', sql: `ALTER TABLE Files ADD COLUMN importance TEXT DEFAULT 'Low'` },
    { name: 'tags', sql: `ALTER TABLE Files ADD COLUMN tags TEXT DEFAULT '[]'` },
    { name: 'confidence', sql: `ALTER TABLE Files ADD COLUMN confidence INTEGER DEFAULT 0` },
  ];

  for (const migration of migrations) {
    if (!columnNames.has(migration.name)) {
      await db.execAsync(migration.sql);
    }
  }
};

export const getDb = () => db;
export const getWebDbKey = () => WEB_DB_KEY;
