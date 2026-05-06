import express from "express";
import cors from "cors";

import bookRouter from "./routers/book.js";
import authRouter from "./routers/auth.js";

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

app.use("/api/books", bookRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} `);
});
