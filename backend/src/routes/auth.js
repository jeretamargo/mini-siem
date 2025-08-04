import express from "express";
import { db_pool } from "../db/db.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log("paso1");

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Campos sin completar" });
    }
    console.log("paso2");
    const existingUser = await db_pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    console.log("paso3");
    if (existingUser.rows.lenght > 0) {
      return res.status(409).json({ error: "Usuario o Email existente" });
    }
    console.log("paso4");
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password.toString(), saltRounds);

    console.log("paso5");
    const newUser = await db_pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, username, email, role, created_at",
      [username, email, passwordHash, role || "analyst"]
    );
    console.log("paso6");

    res
      .status(201)
      .json({ message: "usuario registrado con exito", user: newUser.rows[0] });
    console.log("paso7");
  } catch (err) {
    console.log(`Error en /register: ${err}`);
    res.status(500).json({ error: "Error interno en el servidor" });
  }
});

export default router;
