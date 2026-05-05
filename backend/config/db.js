import path from "path";
import sqlite from "sqlite3";
import { fileURLToPath } from "url";

const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);

const dbPath = path.join(dirname, "library.db");

export const db = new sqlite.Database(dbPath, (error) => {
  if (error) {
    console.log("error in connecting db", error);
  } else {
    console.log("🍕db connected susseccfully");
    db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        author TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT NOT NULL
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
      )`);

    db.run(`CREATE TABLE IF NOT EXISTS book_categories (
      book_id INTEGER NOT NULL,
      category_id INTERGER NOT NULL,
      PRIMARY KEY (book_id,category_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE

      )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userName TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        profile TEXT
        )`);
  }
});
