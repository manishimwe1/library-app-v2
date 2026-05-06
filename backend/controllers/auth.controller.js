import { db } from "../config/db.js";
import bcryptjs from "bcryptjs";

export const signIn = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const existingUserQuery = `SELECT * FROM users WHERE email = ?`;

  db.get(existingUserQuery, [email], (err, rows) => {
    if (err) {
      console.log("something went wrong getting user");
      return res
        .status(404)
        .json({ message: "something went wrong getting user" });
    }
    if (rows) {
      const hashedPassword = bcryptjs.compareSync(password, rows.password);
      if (hashedPassword) {
        return res.status(201).json({
          message: "user logged in successfully",
          user: rows,
        });
      } else {
        return res.status(400).json({
          message: "incorrect password",
        });
      }
    } else {
      return res.status(404).json({
        message: "user doesn't exist try to sign up",
      });
    }
  });
};

export const signUp = (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({
      message: "all fields are required",
    });
  }

  const existingUserQuery = `SELECT * FROM users WHERE email= ?`;

  db.get(existingUserQuery, [email], (err, rows) => {
    if (err) {
      return res.status(400).json({ message: "error in getting user" });
    }
    console.log(rows);
    if (rows) {
      return res.status(404).json({ message: "this email is already exist" });
    } else {
      const query = `INSERT INTO users (userName,email,password) VALUES(?,?,?)`;

      const hashedPassword = bcryptjs.hashSync(password, 12);

      db.run(query, [userName, email, hashedPassword], (err) => {
        if (err) {
          return res.status(400).json({ message: "error in inserting user" });
        }
        return res.status(201).json({
          message: "user created successfully",
        });
      });
    }
  });
};

export const getAllUsers = (req, res) => {
  const query = `SELECT * FROM users`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log("something went wrong getting user");
      return;
    }
    return res.status(200).json(rows);
  });
};
