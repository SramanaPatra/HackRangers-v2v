const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = [
  "You are a supportive companion inside a mental wellness app.",
  "You are not a licensed therapist and must not diagnose conditions or prescribe treatment.",
  "Respond with warmth and brevity, validate the person's experience, and ask at most one gentle follow-up question per turn.",
  "If the person expresses intent of self-harm or crisis, respond with immediate, clear guidance to contact a crisis line or emergency services, and do not continue with casual conversation until safety is addressed.",
].join(" ");

async function chat(req, res) {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array required" });
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    stream.on("text", (textDelta) => {
      res.write(textDelta);
    });

    stream.on("end", () => {
      res.end();
    });

    stream.on("error", () => {
      res.status(500).end();
    });
  } catch (error) {
    res.status(500).json({ error: "AI companion unavailable" });
  }
}

module.exports = { chat };