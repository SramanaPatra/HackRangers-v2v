const express = require("express");
const { register } = require("../controllers/onboarding.controller");

const router = express.Router();

router.post("/register", register);

module.exports = router;