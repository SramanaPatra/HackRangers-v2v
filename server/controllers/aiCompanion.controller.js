const OpenAI = require("openai");

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

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
    const stream = await grok.chat.completions.create({
      model: "grok-4",
      max_tokens: 1024,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        res.write(delta);
      }
    }

    res.end();
  } catch (error) {
    console.error("Grok API error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "AI companion unavailable" });
    } else {
      res.end();
    }
  }
}

module.exports = { chat };