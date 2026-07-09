const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  getComments,
  createComment,
  likeComment,
  unlikeComment,
} = require("../controllers/circles.controller");

const router = express.Router();

router.get("/posts/:postId/comments", getComments);
router.post("/posts/:postId/comments", requireAuth, createComment);
router.post("/comments/:commentId/like", requireAuth, likeComment);
router.delete("/comments/:commentId/like", requireAuth, unlikeComment);

module.exports = router;