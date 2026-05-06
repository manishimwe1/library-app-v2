import express from "express";
import { getAllUsers, signIn, signUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/sign-in", signIn);
router.post("/sign-up", signUp);

export default router
