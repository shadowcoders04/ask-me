import { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    const userMsg = message;
    setMessage("");
    setLoading(true);

    setChat((prev) => [...prev, { from: "user", text: userMsg }]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      setChat((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { from: "bot", text: "Error: Server not responding" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="ai-chat-container">
      <h2 className="ai-title">AskMe AI Chatbot</h2>

      <div className="chat-box">
        {chat.length === 0 && (
          <p className="hint-text">Ask me anything...</p>
        )}

        {chat.map((c, i) => (
          <div
            key={i}
            className={c.from === "user" ? "msg user-msg" : "msg bot-msg"}
          >
            {c.text}
          </div>
        ))}

        {loading && <div className="msg bot-msg">Thinking...</div>}
      </div>

      <div className="chat-input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your question..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
