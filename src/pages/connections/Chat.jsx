import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { createSocketConnection } from "../../utils/socket";
import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
import { IoIosArrowBack } from "react-icons/io";
import { EVENTS } from "../../utils/constants";
import { useAllChats } from "../../hooks/chats/useAllChats";

const Chat = () => {
  // chatPartnerId → the userId of the person you're chatting with (from URL params)
  const { userId: chatPartnerId } = useParams();
  const navigate = useNavigate();
  const { data } = useAllChats();
  console.log("All Chats query", data);

  // messages → array of all chat bubbles (sent + received)
  // messageInput → controlled value of the text input box
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // socketRef → holds the socket instance so we can emit from outside useEffect
  const socketRef = useRef(null);

  // messagesEndRef → points to an invisible div at the bottom of the chat list
  // used to auto-scroll to the latest message
  const messagesEndRef = useRef(null);

  // currentUser → logged-in user from Redux (YOU)
  // currentUserId → your _id, used to check if socket is ready to connect
  const currentUser = useSelector((store) => store?.auth?.user);
  const currentUserId = currentUser?._id;

  // chatPartner → the profile of the person you're chatting with
  // fetched via their userId from the URL
  const {
    data: chatPartner,
    isLoading,
    error,
  } = useUniqueProfile(chatPartnerId);

  // Auto-scroll
  // Runs every time the messages array changes (new message added)
  // scrolls the invisible anchor div into view → latest message always visible
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket Setup
  // Runs when component mounts or when either userId changes
  // Sets up the socket connection and listens for incoming messages
  useEffect(() => {
    // Don't connect until we have both user IDs ready
    if (!currentUserId || !chatPartnerId) return;

    const socket = createSocketConnection();
    socketRef.current = socket; // store in ref so handleSendMessage can access it

    // Step 1: Remove any old listener to avoid duplicates
    // (important if this effect re-runs due to dependency change)
    socket.off(EVENTS.MESSAGE_RECEIVED);

    // Step 2: Attach fresh listener for incoming messages
    // firstName and text come from the backend socket event payload
    socket.on(EVENTS.MESSAGE_RECEIVED, ({ firstName, text }) => {
      setMessages((prev) => [
        ...prev,
        {
          // Unique id: timestamp + random number to avoid React key collisions
          id: `${Date.now()}-${Math.random()}`,
          text,
          sender: "other", // marks this as received message (affects bubble alignment)
          senderName: firstName, // name shown above their bubble
          // Use chatPartner's photo if available, fallback to generated avatar
          avatarUrl:
            chatPartner?.photoURL ||
            "https://api.dicebear.com/7.x/thumbs/svg?seed=default",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    // Step 3: Join the chat room AFTER listener is set up
    // Only send receiverId — backend gets YOUR id from the verified JWT token
    // Never send senderId from client — that's a security risk
    socket.emit(EVENTS.JOIN_CHAT, {
      receiverId: chatPartnerId,
    });

    // Cleanup: disconnect socket when component unmounts or user navigates away
    return () => {
      socket.disconnect();
    };
  }, [currentUserId, chatPartnerId]);

  // Send Message
  const handleSendMessage = () => {
    const trimmed = messageInput.trim();

    // Guard: don't send empty messages or if socket isn't ready
    if (!trimmed || !socketRef.current) return;

    // Emit to backend — only receiverId + text needed
    // Backend reads YOUR identity from socket.user._id (set during JWT auth)
    socketRef.current.emit(EVENTS.SEND_MESSAGE, {
      receiverId: chatPartnerId,
      text: trimmed,
    });

    // Optimistic update: add message to local state immediately
    // Don't wait for server confirmation — feels instant to the user
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        text: trimmed,
        sender: "me", // marks this as sent message (right-aligned bubble)
        senderName: currentUser?.firstName, // YOUR name — not chatPartner's
        avatarUrl: currentUser?.photoURL,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent", // shown below your bubble (sent / delivered / read)
      },
    ]);

    // Clear the input box after sending
    setMessageInput("");
  };

  // Enter Key Handler
  // Sends message on Enter, allows Shift+Enter for new line (future multiline support)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Error State
  // Shows error + a way to navigate back (don't leave user stuck)
  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] flex-col gap-2 text-error">
        <p className="font-semibold">Could not load chat</p>
        <button className="btn btn-sm" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
  }

  // Main UI
  return (
    <div className="flex justify-center mt-6 px-3">
      <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-base-100 shadow-xl rounded-2xl border border-base-300 overflow-hidden">
        {/* Decorative top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />

        {/* ── HEADER ── */}
        <div className="px-4 py-3 border-b bg-base-200 flex items-center gap-3">
          {/* Back button — navigates to previous page */}
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <IoIosArrowBack size={20} />
          </button>

          {/* Chat partner avatar with online indicator */}
          <div className="avatar online">
            <div className="w-10 rounded-full ring-2 ring-primary/30 overflow-hidden">
              <img src={chatPartner?.photoURL} alt={chatPartner?.firstName} />
            </div>
          </div>

          {/* Chat partner name and online status */}
          <div>
            <h2 className="font-semibold text-sm leading-tight">
              {chatPartner?.firstName} {chatPartner?.lastName}
            </h2>
            <p className="text-xs text-success">Online</p>
          </div>
        </div>

        {/* ── MESSAGES AREA ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Empty state — shown when no messages exist yet */}
          {messages.length === 0 && (
            <div className="flex justify-center items-center h-full">
              <p className="text-base-content/30 text-sm">
                No messages yet. Say hello! 👋
              </p>
            </div>
          )}

          {/* Render each message bubble */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              // Align right for "me", left for "other"
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end gap-2 max-w-[70%] ${
                  // Reverse row direction for sent messages (avatar would go right)
                  msg.sender === "me" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar — only show for received messages, not your own */}
                {msg.sender !== "me" && (
                  <div className="avatar">
                    <div className="w-7 rounded-full overflow-hidden">
                      <img src={msg.avatarUrl} alt={msg.senderName} />
                    </div>
                  </div>
                )}

                <div
                  className={`flex flex-col ${
                    msg.sender === "me" ? "items-end" : "items-start"
                  }`}
                >
                  {/* Sender name — only shown for received messages
                      Your own name is never shown (standard chat app behavior) */}
                  {msg.sender !== "me" && (
                    <span className="text-[10px] text-base-content/50 mb-1 px-1">
                      {msg.senderName}
                    </span>
                  )}

                  {/* Message bubble — blue for sent, gray for received */}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow ${
                      msg.sender === "me"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-base-200 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Timestamp + status row */}
                  <div className="text-[10px] mt-1 px-1 opacity-40 flex items-center gap-1">
                    {msg.time}
                    {/* Status (sent/delivered/read) only shown on your messages */}
                    {msg.sender === "me" && (
                      <span className="ml-1">{msg.status}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Invisible anchor div — auto-scroll targets this to show latest message */}
          <div ref={messagesEndRef} />
        </div>

        {/* ── INPUT AREA ── */}
        <div className="px-4 py-3 border-t bg-base-200">
          <div className="flex items-center gap-2">
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown} // Enter key sends message
              type="text"
              placeholder="Type a message..."
              aria-label="Message input"
              className="input input-bordered w-full h-10 text-sm rounded-full px-4 focus:outline-none"
            />
            {/* Disabled when input is empty — prevents sending blank messages */}
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
    </div>
  );
};

export default Chat;
