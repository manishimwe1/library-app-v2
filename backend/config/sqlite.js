import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
console.log({
  fileName,
  dirName,
});

const dbPath = path.join(dirName, "database.db");

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log("error connecting to sqlite", err);
  } else {
    console.log("connected to sqlite successfully");

    db.run(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT  NOT NULL,
            author TEXT NOT NULL,
            price REAL NOT NULL,
            imageSrc TEXT NOT NULL
        )`);
  }
});
