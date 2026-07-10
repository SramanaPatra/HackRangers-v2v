const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { saveEntry, getEntries, getStreak } = require("../controllers/mood.controller");

const router = express.Router();

router.post("/entries", requireAuth, saveEntry);
router.get("/entries", requireAuth, getEntries);
router.get("/streak", requireAuth, getStreak);

module.exports = router;