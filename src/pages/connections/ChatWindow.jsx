import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../../utils/socket";
import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
import { IoIosArrowBack } from "react-icons/io";
import { EVENTS, DEFAULT_AVATAR } from "../../utils/constants";
import { useOrCreateChat } from "../../hooks/chats/useOrCreateChat";

// ─────────────────────────────────────────────
//  WHAT this component does:
//  1. Loads old messages from DB via useOrCreateChat (REST)
//  2. Connects socket for live send/receive
//  3. Renders message bubbles + input box
// ─────────────────────────────────────────────

const ChatWindow = () => {
  const { userId: chatPartnerId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // socketRef: holds socket instance without causing re-renders
  const socketRef = useRef(null);
  // messagesEndRef: invisible div at bottom used for auto-scroll
  const messagesEndRef = useRef(null);
  // chatIdRef: stores chatId once loaded, so socket JOIN has it
  const chatIdRef = useRef(null);

  const currentUser = useSelector((store) => store?.auth?.user);
  const currentUserId = currentUser?._id;

  // chatPartner profile (name, photo) from their userId
  const {
    data: chatPartner,
    isLoading: partnerLoading,
    error: partnerError,
  } = useUniqueProfile(chatPartnerId);

  // ── STEP 1: Load old messages from DB via REST ──
  // WHY: Socket only handles NEW messages sent after page loads.
  //      Old messages must come from DB on mount.
  const { data: chatData, isLoading: chatLoading } =
    useOrCreateChat(chatPartnerId);

  // ── STEP 2: Seed state with old messages when chatData arrives ──
  useEffect(() => {
    if (!chatData?.messages || !currentUserId) return;

    const loaded = [...chatData.messages]
      .reverse() // DB returns newest first → reverse for oldest-first display
      .map((msg) => {
        const isMine = msg.sender?.toString() === currentUserId?.toString();
        return {
          id: msg._id,
          text: msg.text,
          sender: isMine ? "me" : "other",
          senderName: isMine ? currentUser?.firstName : chatPartner?.firstName,
          avatarUrl: isMine
            ? currentUser?.photoURL
            : chatPartner?.photoURL || DEFAULT_AVATAR,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: isMine ? "sent" : undefined,
        };
      });

    setMessages(loaded);

    // Store chatId so socket JOIN can use it
    if (chatData?.chat?._id) {
      chatIdRef.current = chatData.chat._id;
    }
  }, [chatData, currentUserId]);

  // ── STEP 3: Auto-scroll to bottom on new message ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── STEP 4: Socket setup ──
  // WHY separate from REST: REST loads history, socket handles live flow
  useEffect(() => {
    if (!currentUserId || !chatPartnerId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    // Remove old listener first — prevents duplicate messages on re-render
    socket.off(EVENTS.MESSAGE_RECEIVED);

    socket.on(EVENTS.MESSAGE_RECEIVED, ({ firstName, text, createdAt }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          text,
          sender: "other",
          senderName: firstName,
          avatarUrl: chatPartner?.photoURL || DEFAULT_AVATAR,
          time: createdAt
            ? new Date(createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
        },
      ]);
    });

    // Join the socket room
    // WHY send receiverId and not senderId? Backend gets YOUR id from JWT — never trust client for identity
    socket.emit(EVENTS.JOIN_CHAT, {
      receiverId: chatPartnerId,
      ...(chatIdRef.current && { chatId: chatIdRef.current }),
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, chatPartnerId]);

  // ── STEP 5: Send message ──
  const handleSendMessage = () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !socketRef.current) return;

    socketRef.current.emit(EVENTS.SEND_MESSAGE, {
      receiverId: chatPartnerId,
      text: trimmed,
      ...(chatIdRef.current && { chatId: chatIdRef.current }),
    });

    // Optimistic update: show message instantly without waiting for server
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        text: trimmed,
        sender: "me",
        senderName: currentUser?.firstName,
        avatarUrl: currentUser?.photoURL,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      },
    ]);

    setMessageInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ── LOADING STATE ──
  if (partnerLoading || chatLoading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // ── ERROR STATE ──
  if (partnerError) {
    return (
      <div className="flex-1 flex justify-center items-center flex-col gap-3 text-error">
        <p className="font-semibold">Could not load chat</p>
        <button className="btn btn-sm btn-ghost" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* ── HEADER ── */}
      <div className="px-4 py-3 border-b border-base-300 bg-base-200 flex items-center gap-3 shrink-0">
        {/* Back button — visible on mobile */}
        <button
          className="btn btn-ghost btn-sm btn-circle md:hidden"
          onClick={() => navigate("/chat")}
          aria-label="Back to chats"
        >
          <IoIosArrowBack size={20} />
        </button>

        {/* Avatar */}
        <div className="avatar online">
          <div className="w-10 h-10 rounded-full ring-2 ring-primary/30 overflow-hidden">
            <img
              src={chatPartner?.photoURL || DEFAULT_AVATAR}
              alt={chatPartner?.firstName}
              onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
            />
          </div>
        </div>

        {/* Name + status */}
        <div className="flex-1">
          <h2 className="font-semibold text-sm leading-tight text-base-content">
            {chatPartner?.firstName} {chatPartner?.lastName}
          </h2>
          <p className="text-xs text-success">Online</p>
        </div>
      </div>

      {/* ── MESSAGES AREA ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-base-100">
        {messages.length === 0 && (
          <div className="flex flex-col justify-center items-center h-full gap-3">
            <div className="avatar">
              <div className="w-16 h-16 rounded-full overflow-hidden opacity-60">
                <img
                  src={chatPartner?.photoURL || DEFAULT_AVATAR}
                  alt={chatPartner?.firstName}
                  onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                />
              </div>
            </div>
            <p className="text-base-content/40 text-sm">
              No messages yet. Say hello to{" "}
              <span className="font-semibold">{chatPartner?.firstName}</span>!
              👋
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-end gap-2 max-w-[70%] ${
                msg.sender === "me" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar — only for received messages */}
              {msg.sender !== "me" && (
                <div className="avatar shrink-0">
                  <div className="w-7 h-7 rounded-full overflow-hidden">
                    <img
                      src={msg.avatarUrl || DEFAULT_AVATAR}
                      alt={msg.senderName}
                      onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                    />
                  </div>
                </div>
              )}

              <div
                className={`flex flex-col ${
                  msg.sender === "me" ? "items-end" : "items-start"
                }`}
              >
                {/* Sender name — only for received */}
                {msg.sender !== "me" && (
                  <span className="text-[10px] text-base-content/40 mb-1 px-1">
                    {msg.senderName}
                  </span>
                )}

                {/* Bubble */}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "me"
                      ? "bg-primary text-primary-content rounded-br-sm"
                      : "bg-base-200 text-base-content rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Time + status */}
                <div className="text-[10px] mt-1 px-1 opacity-40 flex items-center gap-1">
                  {msg.time}
                  {msg.sender === "me" && msg.status && (
                    <span className="ml-1">{msg.status}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── INPUT AREA ── */}
      <div className="px-4 py-3 border-t border-base-300 bg-base-200 shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder={`Message ${chatPartner?.firstName || ""}...`}
            className="input input-bordered w-full h-10 text-sm rounded-full px-4 focus:outline-none focus:input-primary"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="btn btn-primary btn-sm rounded-full px-5 h-10 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
