const db = require("../db"); // adjust this path if your pg pool lives elsewhere

const ALLOWED = ["❤️", "🤗", "💪"];

async function getReactions(req, res) {
  const { postId } = req.params;
  const userId = req.user?.id || null;
  try {
    const counts = await db.query(
      `SELECT emoji, COUNT(*)::int AS count
       FROM post_reactions WHERE post_id = $1 GROUP BY emoji`,
      [postId]
    );
    let mine = [];
    if (userId) {
      const mineRes = await db.query(
        `SELECT emoji FROM post_reactions WHERE post_id = $1 AND user_id = $2`,
        [postId, userId]
      );
      mine = mineRes.rows.map((r) => r.emoji);
    }
    res.json({ counts: counts.rows, mine });
  } catch (err) {
    res.status(500).json({ message: "Failed to load reactions" });
  }
}

async function addReaction(req, res) {
  const { postId } = req.params;
  const { emoji } = req.body;
  const userId = req.user.id;
  if (!ALLOWED.includes(emoji)) {
    return res.status(400).json({ message: "Invalid reaction" });
  }
  try {
    await db.query(
      `INSERT INTO post_reactions (post_id, user_id, emoji)
       VALUES ($1, $2, $3)
       ON CONFLICT (post_id, user_id, emoji) DO NOTHING`,
      [postId, userId, emoji]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to add reaction" });
  }
}

async function removeReaction(req, res) {
  const { postId, emoji } = req.params;
  const userId = req.user.id;
  try {
    await db.query(
      `DELETE FROM post_reactions WHERE post_id = $1 AND user_id = $2 AND emoji = $3`,
      [postId, userId, emoji]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove reaction" });
  }
}

module.exports = { getReactions, addReaction, removeReaction };