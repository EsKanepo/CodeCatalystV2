import express from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const router = express.Router();

// ✅ LOGIN BIASA
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password]
  );

  if (user.length === 0) {
    return res.status(401).json({
      success: false,
      message: "Email / password salah"
    });
  }

  const token = jwt.sign(
    { id: user[0].id },
    env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    success: true,
    data: {
      user: user[0],
      token
    }
  });
});

// ✅ GOOGLE LOGIN
router.post("/google", async (req, res) => {
  const { name, email } = req.body;

  let user = await db("SELECT * FROM users WHERE email = ?", [email]);

  if (user.length === 0) {
    await db(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );

    user = await db("SELECT * FROM users WHERE email = ?", [email]);
  }

  const token = jwt.sign(
    { id: user[0].id },
    env.JWT_SECRET, // 🔥 WAJIB SAMA
    { expiresIn: "1d" }
  );

  res.json({
    success: true,
    data: {
      user: user[0],
      token
    }
  });
});

export default router;