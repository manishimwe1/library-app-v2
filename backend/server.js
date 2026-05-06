import express from "express";
import { db } from "./config/db.js";
import cors from "cors";
import bcryptjs from "bcryptjs";

const app = express();
const PORT = 3000;

app.use(
  express.json({
    limit: "50mb",
  }),
);

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.get("/api/search/:search", (req, res) => {
  const { search } = req.params;
  console.log(search);

  const searchQuery = `SELECT * FROM books WHERE name LIKE '%${search}%'`;
  db.all(searchQuery, (err, rows) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "something went wrong", error: err });
    }

    return res.status(200).json({ message: "this is data", data: rows });
  });
});

app.post("/api/sign-in", (req, res) => {
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
});

app.get("/api/auth", (req, res) => {
  const query = `SELECT * FROM users`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log("something went wrong getting user");
      return;
    }
    return res.status(200).json(rows);
  });
});

app.post("/api/sign-up", (req, res) => {
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
});

app.post("/api/books", (req, res) => {
  const { name, description, author, price, image, category } = req.body;

  if (!name || !description || !author || !price || !image) {
    return res.status(400).json("all fields are required");
  }

  console.log(category);
  

  const query = `INSERT INTO books (name,description,author,price,image) VALUES (?,?,?,?,?)`;

  db.run(query, [name, description, author, price, image], function (err) {
    if (err) {
      console.log("error in creating books");
      return res.status(400).json({ message: "error in creating books" });
    } else {
      console.log("added book in db successfuly");

      const bookId = this.lastID;

      const existCategoryQuery = `SELECT * FROM categories WHERE name = ?`;

      db.get(existCategoryQuery, [category], (err, row) => {
        if (err) {
          console.log("error in getting category books");
          return res.status(400).json({ message: "error in getting category" });
        }

        let categoryId;

        if (row) {
          categoryId = row.id;
          linkBookToCategory(categoryId, bookId, res);
        } else {
          const categoryQuery = `INSERT INTO categories (name) VALUES (?)`;
          db.run(categoryQuery, [category], function (err) {
            console.log(category);

            if (err) {
              console.log("error in creating category", err);
              return res.status(400).json({ message: "error in creating category" });
            }

            categoryId = this.lastID;

            linkBookToCategory(categoryId, bookId, res);
          });
        }
      });
    }
  });
});

function linkBookToCategory(bookId, categoryId, res) {
  const linkQuery = `INSERT INTO book_categories (book_id,category_id) VALUES (?,?)`;

  db.run(linkQuery, [bookId, categoryId], (err) => {
    if (err) {
      console.log("something went wrong inserting book category");
      return res.status(400).json({ message: "error linking book to category" });
    }
    return res
      .status(201)
      .json({ message: "book created successfuly", id: bookId });
  });
}

app.get("/api/category", (req, res) => {
  const query = `SELECT * FROM categories`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log("something went wrong getting books");
      return;
    }
    return res.status(200).json(rows);
  });
});
app.get("/api/books", (req, res) => {
  const query = `SELECT * FROM books`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log("something went wrong getting books");
      return;
    }
    return res.status(200).json(rows);
  });
});

app.get("/api/books/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "missing book id",
    });
  }

  const query = `SELECT * FROM books WHERE id=?`;

  db.all(query, [id], (err, rows) => {
    if (err) {
      console.log("something went wrong getting books");
      return;
    }
    return res.status(200).json(rows[0]);
  });
});

app.put("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, author, price } = req.body;

  if (!name || !description || !author || !price || !id) {
    return res.status(400).json("all fields are required or id is missing");
  }

  const query = `UPDATE books SET name=?, description=?, author=?, price=? WHERE id=?`;
  db.run(query, [name, description, author, price, id], (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "something went wrong while updating book" });
    }
    return res.status(200).json({ message: "book was updated successfully" });
  });
});

app.delete("/api/books/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "missing book id",
    });
  }

  const query = `DELETE FROM books WHERE id = ?`;
  db.run(query, [id], (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "something went wrong while delete book" });
    }
    return res.status(200).json({ message: "book was deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} `);
});
