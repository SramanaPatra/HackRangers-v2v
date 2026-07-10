const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");

const VALID_ROLES = ["student", "it_professional", "homemaker", "other"];

async function register(req, res) {
  const { name, age, phone, role, email, password } = req.body;

  if (!name || !age || !phone || !VALID_ROLES.includes(role) || !email || !password) {
    return res.status(400).json({ error: "Invalid or missing fields" });
  }

  if (age < 13 || age > 120) {
    return res.status(400).json({ error: "Age out of allowed range" });
  }

  if (!/^\+?[0-9\s-]{7,20}$/.test(phone)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, age, phone, role, email, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, age, phone, role, email, created_at`,
      [name, age, phone, role, email, passwordHash]
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

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const result = await pool.query(
    `SELECT id, name, age, phone, role, email, password_hash FROM users WHERE email = $1`,
    [email]
  );

  if (result.rowCount === 0) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  delete user.password_hash;
  res.json({ user, token });
}

module.exports = { register, login };