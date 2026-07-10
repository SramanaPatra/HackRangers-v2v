const pool = require("../db/pool");

const VALID_ROLES = ["student", "it_professional", "homemaker", "other"];

async function getMe(req, res) {
  const userId = req.user.id;

  const result = await pool.query(
    `SELECT id, name, age, phone, role, email, created_at FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(result.rows[0]);
}

async function updateMe(req, res) {
  const userId = req.user.id;
  const { name, age, phone, role } = req.body;

  if (role && !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  if (age !== undefined && age !== null && (age < 13 || age > 120)) {
    return res.status(400).json({ error: "Age out of allowed range" });
  }

  if (phone && !/^\+?[0-9\s-]{7,20}$/.test(phone)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  const result = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         age = COALESCE($2, age),
         phone = COALESCE($3, phone),
         role = COALESCE($4, role)
     WHERE id = $5
     RETURNING id, name, age, phone, role, email, created_at`,
    [name ?? null, age ?? null, phone ?? null, role ?? null, userId]
  );

  res.json(result.rows[0]);
}

module.exports = { getMe, updateMe };