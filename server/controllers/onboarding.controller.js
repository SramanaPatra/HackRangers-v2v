const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");

const VALID_ROLES = ["student", "it_professional", "homemaker", "other"];

async function register(req, res) {
  const { name, age, role, email, password } = req.body;

  if (!name || !age || !VALID_ROLES.includes(role) || !email || !password) {
    return res.status(400).json({ error: "Invalid or missing fields" });
  }

  if (age < 13 || age > 120) {
    return res.status(400).json({ error: "Age out of allowed range" });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, age, role, email, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, age, role, email, created_at`,
      [name, age, role, email, passwordHash]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
}

module.exports = { register };