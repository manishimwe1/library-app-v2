import express from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBooksById,
  searchBook,
  updateBook,
} from "../controllers/books.controller.js";
import { authenticationToken } from "../middleware/auth.js";

const router = express.Router();

//public router
router.get("/", getAllBooks);
router.get("/:id", getBooksById);
router.get("/:search", searchBook);

//private router we need to authenticationToken fn so we protect this endpoint
router.post("/", createBook);
router.delete("/:id", deleteBook);
router.put("/:id", updateBook);

export default router;
