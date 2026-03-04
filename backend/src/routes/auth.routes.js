import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.userId });
});

router.post("/logout", authMiddleware, logoutUser);
export default router;
