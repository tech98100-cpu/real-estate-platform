import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import api from "../api/axios.js";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! Tell me what you're looking for — e.g. '2 bed apartment in Lahore under 70000/mo'." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", { message: userMsg.text });
      setMessages((prev) => [...prev, { role: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I couldn't process that right now. Please try browsing properties directly." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-80 sm:w-96 h-96 bg-white rounded-2xl shadow-2xl border border-gold/20 flex flex-col overflow-hidden">
          <div className="bg-ink text-offwhite px-4 py-3 flex items-center gap-2">
            <Sparkles size={16} className="text-gold" />
            <span className="font-semibold text-sm">Estately AI Assistant</span>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-xl ${
                  m.role === "user"
                    ? "bg-gold/20 text-ink ml-auto rounded-br-sm"
                    : "bg-offwhite text-ink rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="text-ink/40 text-xs">Thinking...</div>}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="flex items-center gap-2 border-t border-black/5 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about properties..."
              className="flex-1 bg-offwhite rounded-full px-4 py-2 text-sm outline-none"
            />
            <button type="submit" className="bg-gold text-ink p-2 rounded-full">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-ink hover:bg-gold text-offwhite hover:text-ink p-4 rounded-full shadow-xl transition-colors"
        aria-label="Toggle AI chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default ChatWidget;
