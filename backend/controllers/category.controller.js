import { db } from "../config/db.js";

export const getAllBookCategory = (req, res) => {
  const query = `SELECT * FROM categories`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log("something went wrong getting books");
      return;
    }
    return res.status(200).json(rows);
  });
};
