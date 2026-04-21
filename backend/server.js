import express from "express";
import { db } from "./config/sqlite.js";
// import { connectToDb } from './config/db.js';

const PORT = 3000;
const app = express();
// connectToDb()

app.post("/api/books", (req, res) => {
  const { name, description, author, price, imageSrc } = req.body;
  if (!name || !description || !author || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const query = `INSERT INTO books (name, description, author, price,imageSrc) VALUES (?, ?, ?, ?,?)`;
  db.run(query, [name, description, author, price, imageSrc], (err) => {
    if (err) {
      return console.log("error in creating books", err);
    }
    console.log("inserted books in db successfully.");
    return res.status(201).json({ message: "Created successfully" })
  });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
