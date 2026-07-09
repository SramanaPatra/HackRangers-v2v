import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { getToken } from "../api/client.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function AICompanion() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || streaming) return;

    const userMessage = { role: "user", content: input };
    const nextMessages = [...messages, userMessage, { role: "assistant", content: "" }];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);

    const response = await fetch(`${API_BASE}/ai-companion/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: accumulated };
        return updated;
      });
    }

    setStreaming(false);
  };

  return (
    <div className="animate-driftIn">
      <p className="eyebrow mb-2">AI companion</p>
      <h1 className="text-3xl font-medium mb-6">Talk it through.</h1>

      <div className="card flex flex-col h-[560px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                message.role === "user" ? "self-end bg-blossom text-white" : "self-start bg-sage text-white"
              }`}
            >
              {message.content || (streaming && index === messages.length - 1 ? "..." : "")}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Talk it through"
            className="flex-1 bg-petal-soft rounded-full px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blossom/40"
          />
          <button onClick={sendMessage} disabled={streaming} className="btn-primary px-4 disabled:opacity-40">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}