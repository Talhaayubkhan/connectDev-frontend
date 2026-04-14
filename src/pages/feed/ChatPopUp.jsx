// components/chat/ChatPopup.jsx
import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaRobot } from "react-icons/fa";
import { useFetchAiChat } from "../../hooks/chats/useFetchAiChat";

const ChatPopup = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // ✅ Hook called at TOP LEVEL of component — correct
  const { mutateAsync, isPending } = useFetchAiChat();
  // isPending replaces your manual isLoading state
  // mutateAsync is the function you call when sending

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isPending) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");

    try {
      // ✅ mutateAsync is a regular async function — safe to await
      const reply = await mutateAsync(updatedMessages);

      const botMessage = { role: "model", content: reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Sorry, something went wrong. Try again." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-80 h-[450px] 
                    flex flex-col rounded-2xl shadow-2xl 
                    bg-base-100 border border-base-300"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 
                      bg-primary text-primary-content rounded-t-2xl"
      >
        <div className="flex items-center gap-2">
          <FaRobot size={16} />
          <span className="font-semibold text-sm">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-xs text-primary-content"
        >
          <FaTimes size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-base-content/40">
            <FaRobot size={32} />
            <p className="text-sm text-center">Ask me anything!</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
          >
            <div
              className={`chat-bubble text-sm ${
                msg.role === "user"
                  ? "chat-bubble-primary"
                  : "chat-bubble-neutral"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* isPending from useMutation — no manual state needed */}
        {isPending && (
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-neutral">
              <span className="loading loading-dots loading-xs" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-base-300 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isPending}
          className="input input-bordered input-sm flex-1 text-sm"
        />
        <button
          onClick={sendMessage}
          disabled={isPending || !input.trim()}
          className="btn btn-primary btn-sm"
        >
          <FaPaperPlane size={12} />
        </button>
      </div>
    </div>
  );
};
export default ChatPopup;
