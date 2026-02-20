"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What projects have you built?",
  "What's your tech stack?",
  "Are you open to work?",
  "How can I contact you?",
];

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm Rodrigo's AI assistant. Ask me anything about his work, skills, projects, or how to get in touch. 👋",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasNew(false);
    }
  }, [open, messages]);

  const send = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply =
        data.content?.[0]?.text ?? "Sorry, I couldn't get a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      if (!open) setHasNew(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .chat-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6c63ff 0%, #00d4ff 100%);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(108,99,255,0.5);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          color: white;
        }

        .chat-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 40px rgba(108,99,255,0.7);
        }

        .chat-fab-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ff6b9d;
          border: 2px solid #080810;
          animation: pulseBadge 1.5s ease-in-out infinite;
        }

        @keyframes pulseBadge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        .chat-window {
          position: fixed;
          bottom: 6rem;
          right: 2rem;
          z-index: 1000;
          width: 380px;
          max-height: 560px;
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(108,99,255,0.1);
          transform-origin: bottom right;
          animation: chatOpen 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }

        @keyframes chatOpen {
          from { opacity: 0; transform: scale(0.85) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .chat-header {
          padding: 1rem 1.25rem;
          background: linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(0,212,255,0.08) 100%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chat-header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6c63ff, #00d4ff);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1rem;
        }

        .chat-header-info {
          flex: 1;
        }

        .chat-header-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #e8e8f0;
          font-family: 'Syne', sans-serif;
        }

        .chat-header-status {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          color: #6b6b8a;
          letter-spacing: 0.05em;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00d4ff;
          animation: pulseBadge 2s ease-in-out infinite;
        }

        .chat-close {
          background: none;
          border: none;
          color: #6b6b8a;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          transition: color 0.2s;
          border-radius: 4px;
        }

        .chat-close:hover { color: #e8e8f0; background: rgba(255,255,255,0.05); }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(108,99,255,0.3) transparent;
        }

        .chat-messages::-webkit-scrollbar { width: 3px; }
        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(108,99,255,0.3);
          border-radius: 2px;
        }

        .msg {
          display: flex;
          gap: 0.5rem;
          max-width: 100%;
          animation: msgIn 0.2s ease forwards;
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .msg.user { flex-direction: row-reverse; }

        .msg-bubble {
          padding: 0.65rem 0.9rem;
          border-radius: 12px;
          font-size: 0.82rem;
          line-height: 1.55;
          max-width: 80%;
          word-break: break-word;
        }

        .msg.assistant .msg-bubble {
          background: #161628;
          color: #c8c8dc;
          border: 1px solid rgba(255,255,255,0.06);
          border-bottom-left-radius: 4px;
          font-family: 'Syne', sans-serif;
        }

        .msg.user .msg-bubble {
          background: linear-gradient(135deg, #6c63ff, #5a52e8);
          color: white;
          border-bottom-right-radius: 4px;
          font-family: 'Syne', sans-serif;
        }

        .msg-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          margin-top: 2px;
        }

        .msg.assistant .msg-avatar {
          background: linear-gradient(135deg, #6c63ff, #00d4ff);
          color: white;
        }

        .msg.user .msg-avatar {
          background: #161628;
          border: 1px solid rgba(255,255,255,0.1);
          color: #6b6b8a;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 0.65rem 0.9rem;
          background: #161628;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          border-bottom-left-radius: 4px;
          width: fit-content;
        }

        .typing-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #6c63ff;
          animation: typingBounce 1.2s ease-in-out infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .typing-dot:nth-child(3) { animation-delay: 0.3s; }

        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }

        .chat-suggestions {
          padding: 0.5rem 1rem;
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          border-top: 1px solid rgba(255,255,255,0.04);
          background: rgba(8,8,16,0.5);
        }

        .suggestion-btn {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.03em;
          padding: 0.3rem 0.65rem;
          background: rgba(108,99,255,0.08);
          border: 1px solid rgba(108,99,255,0.2);
          border-radius: 20px;
          color: #9999cc;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .suggestion-btn:hover {
          background: rgba(108,99,255,0.18);
          color: #e8e8f0;
          border-color: rgba(108,99,255,0.4);
        }

        .chat-input-row {
          padding: 0.75rem 1rem;
          display: flex;
          gap: 0.5rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: #080810;
        }

        .chat-input {
          flex: 1;
          background: #161628;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 0.6rem 0.85rem;
          color: #e8e8f0;
          font-family: 'Syne', sans-serif;
          font-size: 0.82rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .chat-input::placeholder { color: #4a4a6a; }

        .chat-input:focus {
          border-color: rgba(108,99,255,0.4);
          box-shadow: 0 0 0 3px rgba(108,99,255,0.08);
        }

        .chat-send {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, #6c63ff, #00d4ff);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          transition: opacity 0.2s, transform 0.2s;
        }

        .chat-send:hover:not(:disabled) { opacity: 0.85; transform: scale(1.05); }
        .chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (max-width: 480px) {
          .chat-window {
            right: 1rem;
            left: 1rem;
            width: auto;
            bottom: 5.5rem;
          }
          .chat-fab { bottom: 1.5rem; right: 1.5rem; }
        }
      `}</style>

      {/* FAB Button */}
      <button
        className="chat-fab"
        onClick={() => { setOpen((o) => !o); setHasNew(false); }}
        aria-label="Open AI Chat"
        style={{ cursor: "pointer" }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 4h14a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 3V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="8" cy="10" r="1" fill="currentColor"/>
            <circle cx="11" cy="10" r="1" fill="currentColor"/>
            <circle cx="14" cy="10" r="1" fill="currentColor"/>
          </svg>
        )}
        {hasNew && <span className="chat-fab-badge" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-avatar">🤖</div>
            <div className="chat-header-info">
              <div className="chat-header-name">Rodrigo's AI Assistant</div>
              <div className="chat-header-status">
                <span className="status-dot" />
                Online — ask me anything
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.role}`}>
                <div className="msg-avatar">
                  {msg.role === "assistant" ? "RL" : "U"}
                </div>
                <div className="msg-bubble">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="msg assistant">
                <div className="msg-avatar">RL</div>
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (show only on first message) */}
          {messages.length <= 1 && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggestion-btn"
                  onClick={() => send(s)}
                  style={{ cursor: "pointer" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-input-row">
            <input
              ref={inputRef}
              className="chat-input"
              placeholder="Ask about Rodrigo's work..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <button
              className="chat-send"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{ cursor: "pointer" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 1L6 8M13 1L9 13l-3-5-5-3 12-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}