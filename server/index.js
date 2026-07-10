const express = require("express");
const cors = require("cors");
require("dotenv").config();

const onboardingRoutes = require("./routes/onboarding.routes");
const circlesRoutes = require("./routes/circles.routes");
const aiCompanionRoutes = require("./routes/aiCompanion.routes");
const moodRoutes = require("./routes/mood.routes");

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

app.use("/api/onboarding", onboardingRoutes);
app.use("/api/circles", circlesRoutes);
app.use("/api/ai-companion", aiCompanionRoutes);
app.use("/api/mood", moodRoutes);
const usersRoutes = require("./routes/users.routes");
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MindEase server running on port ${PORT}`);
});