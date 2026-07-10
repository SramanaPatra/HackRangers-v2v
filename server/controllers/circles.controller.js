const pool = require("../db/pool");

function buildCommentTree(flatComments) {
  const map = new Map();
  const roots = [];

  flatComments.forEach((comment) => {
    map.set(comment.id, { ...comment, children: [] });
  });

  flatComments.forEach((comment) => {
    const node = map.get(comment.id);
    if (comment.parent_id) {
      const parent = map.get(comment.parent_id);
      if (parent) parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

async function listCircles(req, res) {
  const result = await pool.query(
    `SELECT id, name, slug, created_at FROM circles ORDER BY name ASC`
  );
  res.json(result.rows);
}

async function listPosts(req, res) {
  const { circleId } = req.params;

  const result = await pool.query(
    `SELECT p.id, p.body, p.created_at, u.name AS author_name,
            COUNT(c.id) AS comment_count
     FROM posts p
     JOIN users u ON u.id = p.author_id
     LEFT JOIN comments c ON c.post_id = p.id
     WHERE p.circle_id = $1
     GROUP BY p.id, u.name
     ORDER BY p.created_at DESC`,
    [circleId]
  );

  res.json(result.rows);
}

async function createPost(req, res) {
  const { circleId } = req.params;
  const { body } = req.body;
  const authorId = req.user.id;

  if (!body || !body.trim()) {
    return res.status(400).json({ error: "Post body is required" });
  }

  const result = await pool.query(
    `INSERT INTO posts (circle_id, author_id, body)
     VALUES ($1, $2, $3)
     RETURNING id, circle_id, body, created_at`,
    [circleId, authorId, body]
  );

  res.status(201).json(result.rows[0]);
}

async function getComments(req, res) {
  const { postId } = req.params;
  const userId = req.user ? req.user.id : null;

  const result = await pool.query(
    `SELECT c.id, c.parent_id, c.body, c.depth, c.created_at,
            u.name AS author_name,
            COUNT(cl.user_id) AS like_count,
            BOOL_OR(cl.user_id = $2) AS liked_by_user
     FROM comments c
     JOIN users u ON u.id = c.author_id
     LEFT JOIN comment_likes cl ON cl.comment_id = c.id
     WHERE c.post_id = $1
     GROUP BY c.id, u.name
     ORDER BY c.created_at ASC`,
    [postId, userId]
  );

  res.json(buildCommentTree(result.rows));
}

async function createComment(req, res) {
  const { postId } = req.params;
  const { body, parentId } = req.body;
  const authorId = req.user.id;

  if (!body || !body.trim()) {
    return res.status(400).json({ error: "Comment body is required" });
  }

  let depth = 0;
  if (parentId) {
    const parentResult = await pool.query(
      `SELECT depth FROM comments WHERE id = $1`,
      [parentId]
    );
    if (parentResult.rowCount === 0) {
      return res.status(404).json({ error: "Parent comment not found" });
    }
    depth = parentResult.rows[0].depth + 1;
  }

  const result = await pool.query(
    `INSERT INTO comments (post_id, parent_id, author_id, body, depth)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, post_id, parent_id, body, depth, created_at`,
    [postId, parentId || null, authorId, body, depth]
  );

  res.status(201).json(result.rows[0]);
}

async function likeComment(req, res) {
  const { commentId } = req.params;
  const userId = req.user.id;

  await pool.query(
    `INSERT INTO comment_likes (comment_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (comment_id, user_id) DO NOTHING`,
    [commentId, userId]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1`,
    [commentId]
  );

  res.json({ liked: true, totalLikes: Number(countResult.rows[0].count) });
}

async function unlikeComment(req, res) {
  const { commentId } = req.params;
  const userId = req.user.id;

  await pool.query(
    `DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
    [commentId, userId]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1`,
    [commentId]
  );

  res.json({ liked: false, totalLikes: Number(countResult.rows[0].count) });
}

module.exports = {
  listCircles,
  listPosts,
  createPost,
  getComments,
  createComment,
  likeComment,
  unlikeComment,
};