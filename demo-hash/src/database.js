import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { config } from "./config.js";

class DatabaseManager {
  constructor() {
    this.db = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    // Criar diretório de dados se não existir
    const dataDir = path.dirname(config.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(config.dbPath);
    this.db.pragma("journal_mode = WAL");

    this.createTablesIfNotExist();
    this.initialized = true;
  }

  createTablesIfNotExist() {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        is_active BOOLEAN DEFAULT 1
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
    `;

    this.db.exec(createUsersTable);
    this.db.exec(createIndexes);
  }

  getUserByEmail(email) {
    const stmt = this.db.prepare(
      "SELECT * FROM users WHERE email = ? AND is_active = 1"
    );
    return stmt.get(email);
  }

  getUserById(id) {
    const stmt = this.db.prepare(
      "SELECT * FROM users WHERE id = ? AND is_active = 1"
    );
    return stmt.get(id);
  }

  createUser(email, name, passwordHash) {
    const stmt = this.db.prepare(`
      INSERT INTO users (email, name, password_hash)
      VALUES (?, ?, ?)
    `);

    try {
      const result = stmt.run(email, name, passwordHash);
      return {
        id: result.lastInsertRowid,
        email,
        name,
        created_at: new Date(),
      };
    } catch (error) {
      if (error.message.includes("UNIQUE constraint failed")) {
        throw new Error("Email já cadastrado");
      }
      throw error;
    }
  }

  updateLastLogin(userId) {
    const stmt = this.db.prepare(`
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(userId);
  }

  getUserProfile(userId) {
    const stmt = this.db.prepare(`
      SELECT id, email, name, created_at, updated_at, last_login
      FROM users
      WHERE id = ? AND is_active = 1
    `);
    return stmt.get(userId);
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export const db = new DatabaseManager();
