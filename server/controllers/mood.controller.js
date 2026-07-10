const pool = require("../db/pool");

async function saveEntry(req, res) {
  const userId = req.user.id;
  const { moodScore, tags, note, entryDate } = req.body;

  if (!moodScore || moodScore < 1 || moodScore > 5) {
    return res.status(400).json({ error: "moodScore must be between 1 and 5" });
  }

  const date = entryDate || new Date().toISOString().slice(0, 10);

  const result = await pool.query(
    `INSERT INTO mood_entries (user_id, mood_score, tags, note, entry_date)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, entry_date)
     DO UPDATE SET mood_score = $2, tags = $3, note = $4
     RETURNING id, mood_score, tags, note, entry_date, created_at`,
    [userId, moodScore, tags || [], note || null, date]
  );

  res.status(201).json(result.rows[0]);
}

async function getEntries(req, res) {
  const userId = req.user.id;
  const { days } = req.query;
  const lookback = Number(days) > 0 ? Number(days) : 30;

  const result = await pool.query(
    `SELECT id, mood_score, tags, note, entry_date, created_at
     FROM mood_entries
     WHERE user_id = $1 AND entry_date >= CURRENT_DATE - $2::int
     ORDER BY entry_date ASC`,
    [userId, lookback]
  );

  res.json(result.rows);
}

async function getStreak(req, res) {
  const userId = req.user.id;

  const result = await pool.query(
    `SELECT entry_date FROM mood_entries
     WHERE user_id = $1
     ORDER BY entry_date DESC`,
    [userId]
  );

  const dates = result.rows.map((r) => r.entry_date.toISOString().slice(0, 10));
  let streak = 0;
  let cursor = new Date();

  for (let i = 0; i < dates.length; i++) {
    const expected = cursor.toISOString().slice(0, 10);
    if (dates[i] === expected) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  res.json({ streak });
}

module.exports = { saveEntry, getEntries, getStreak };