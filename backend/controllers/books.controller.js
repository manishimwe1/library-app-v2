import { db } from "../config/db.js";


export const searchBook = (req, res) => {
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
}


export const createBook = (req, res) => {
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
              return res
                .status(400)
                .json({ message: "error in creating category" });
            }

            categoryId = this.lastID;

            linkBookToCategory(categoryId, bookId, res);
          });
        }
      });
    }
  });
};

function linkBookToCategory(bookId, categoryId, res) {
  const linkQuery = `INSERT INTO book_categories (book_id,category_id) VALUES (?,?)`;

  db.run(linkQuery, [bookId, categoryId], (err) => {
    if (err) {
      console.log("something went wrong inserting book category");
      return res
        .status(400)
        .json({ message: "error linking book to category" });
    }
    return res
      .status(201)
      .json({ message: "book created successfuly", id: bookId });
  });
}

export const updateBook = (req, res) => {
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
};

export const getAllBooks = (req, res) => {
  const query = `SELECT * FROM books`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log("something went wrong getting books");
      return;
    }
    return res.status(200).json(rows);
  });
};

export const getBooksById = (req, res) => {
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
};

export const deleteBook = (req, res) => {
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
};
