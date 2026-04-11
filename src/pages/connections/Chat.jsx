import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../../utils/socket";
import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
import { IoIosArrowBack } from "react-icons/io";
import { EVENTS, DEFAULT_AVATAR } from "../../utils/constants";
import { useOrCreateChat } from "../../hooks/chats/useOrCreateChat";
import { buildMessage } from "../../utils/chatHelpers";

// WHY useShowProfile instead of useSelector:
// Redux auth.user is null on refresh — we removed Redux as
// the source of truth. useShowProfile reads from React Query
// cache which is rehydrated from the server on every mount.
import { useShowProfile } from "../../hooks/profile/useShowProfile";

const ChatWindow = () => {
  const { userId: chatPartnerId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatIdRef = useRef(null);

  // WHY replace useSelector with useShowProfile:
  // useSelector(store.auth.user) returns null on page refresh
  // because Redux state resets. useShowProfile reads from
  // React Query cache which survives via the server fetch.
  const { data: currentUser } = useShowProfile();
  const currentUserId = currentUser?._id || currentUser?.id;

  // WHY both _id and id:
  // Your backend login response uses `id` (safeUser object).
  // Your DB documents use `_id`. Depending on which endpoint
  // populated the cache, either could be present.
  // We normalise here so comparisons below always work.

  const {
    data: chatPartner,
    isLoading: partnerLoading,
    error: partnerError,
  } = useUniqueProfile(chatPartnerId);

  const { data: chatData, isLoading: chatLoading } =
    useOrCreateChat(chatPartnerId);

  // ── STEP 1: Seed state with old messages from DB ──
  useEffect(() => {
    if (!chatData?.messages || !currentUserId) return;

    const loaded = [...chatData.messages]
      .reverse() // WHY reverse: DB returns newest-first, UI needs oldest-first
      .map((msg) => {
        const isMine = msg.sender?.toString() === currentUserId?.toString();

        return buildMessage({
          id: msg._id,
          text: msg.text,
          sender: isMine ? "me" : "other",
          senderName: isMine ? currentUser?.firstName : chatPartner?.firstName,
          avatarUrl: isMine ? currentUser?.photoURL : chatPartner?.photoURL,
          createdAt: msg.createdAt,
          status: isMine ? "sent" : undefined,
        });
      });

    setMessages(loaded);

    if (chatData?.chat?._id) {
      chatIdRef.current = chatData.chat._id;
    }
  }, [chatData, currentUserId]);

  // ── STEP 2: Auto-scroll on new message ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── STEP 3: Socket setup ──
  useEffect(() => {
    if (!currentUserId || !chatPartnerId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    // WHY off() before on():
    // Without this, each re-render adds another listener.
    // You would receive duplicate messages after navigation.
    socket.off(EVENTS.MESSAGE_RECEIVED);

    socket.on(EVENTS.MESSAGE_RECEIVED, ({ firstName, text, createdAt }) => {
      setMessages((prev) => [
        ...prev,
        buildMessage({
          text,
          sender: "other",
          senderName: firstName,
          avatarUrl: chatPartner?.photoURL,
          createdAt,
        }),
      ]);
    });

    // WHY only receiverId and not senderId:
    // Backend derives YOUR identity from the JWT cookie.
    // Never trust the client to identify itself — that can be spoofed.
    socket.emit(EVENTS.JOIN_CHAT, {
      receiverId: chatPartnerId,
      ...(chatIdRef.current && { chatId: chatIdRef.current }),
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, chatPartnerId]);

  // ── STEP 4: Send message ──
  const handleSendMessage = () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !socketRef.current) return;

    socketRef.current.emit(EVENTS.SEND_MESSAGE, {
      receiverId: chatPartnerId,
      text: trimmed,
      ...(chatIdRef.current && { chatId: chatIdRef.current }),
    });

    // WHY optimistic update:
    // We show the message immediately without waiting for server
    // confirmation. This makes the UI feel instant.
    // If the socket fails, the message stays visible but was
    // never saved — a known trade-off in this architecture.
    setMessages((prev) => [
      ...prev,
      buildMessage({
        text: trimmed,
        sender: "me",
        senderName: currentUser?.firstName,
        avatarUrl: currentUser?.photoURL,
        status: "sent",
      }),
    ]);

    setMessageInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (partnerLoading || chatLoading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

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
        <button
          className="btn btn-ghost btn-sm btn-circle md:hidden"
          onClick={() => navigate("/chat")}
          aria-label="Back to chats"
        >
          <IoIosArrowBack size={20} />
        </button>

        <div className="avatar">
          <div className="w-10 h-10 rounded-full ring-2 ring-primary/30 overflow-hidden">
            <img
              src={chatPartner?.photoURL || DEFAULT_AVATAR}
              alt={chatPartner?.firstName}
              onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
            />
          </div>
        </div>

        <div className="flex-1">
          <h2 className="font-semibold text-sm leading-tight text-base-content">
            {chatPartner?.firstName} {chatPartner?.lastName}
          </h2>
          {/* WHY always show Online here:
              The chat partner's real-time status would require
              a presence socket event — not implemented yet.
              This is a known placeholder. */}
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
                {msg.sender !== "me" && (
                  <span className="text-[10px] text-base-content/40 mb-1 px-1">
                    {msg.senderName}
                  </span>
                )}

                <div
                  className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "me"
                      ? "bg-primary text-primary-content rounded-br-sm"
                      : "bg-base-200 text-base-content rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>

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
