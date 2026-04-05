import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createSocketConnection } from "../../utils/socket";
import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
import { IoIosArrowBack } from "react-icons/io";
import { EVENTS, DEFAULT_AVATAR, buildMessage } from "../../utils/constants";
import { useOrCreateChat } from "../../hooks/chats/useOrCreateChat";
import { fetchMessages } from "../../services/chats/allChats";

// Helper: build a normalised message object from raw DB/socket data

const ChatWindow = () => {
  const { userId: chatPartnerId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesTopRef = useRef(null); // sentinel for infinite scroll up
  const chatIdRef = useRef(null);
  const pageRef = useRef(1); // ref mirror so loadOlder callback is stable
  const seenIdsRef = useRef(new Set()); // FIX: dedup guard — prevents duplicate messages on reconnect

  // WHY ref: socket callback needs latest chatPartner without re-creating the socket
  const chatPartnerRef = useRef(null);

  const currentUser = useSelector((store) => store?.auth?.user);
  const currentUserId = currentUser?._id;

  const {
    data: chatPartner,
    isLoading: partnerLoading,
    error: partnerError,
  } = useUniqueProfile(chatPartnerId);

  const { data: chatData, isLoading: chatLoading } =
    useOrCreateChat(chatPartnerId);

  // Keep ref in sync so socket callback always has fresh chatPartner
  useEffect(() => {
    chatPartnerRef.current = chatPartner;
  }, [chatPartner]);

  // ── Seed messages from DB on initial load ────────────────────────────────
  useEffect(() => {
    if (!chatData?.messages || !currentUserId) return;

    const loaded = [...chatData.messages].reverse().map((msg) => {
      const isMine = msg.sender?.toString() === currentUserId?.toString();
      const id = msg._id;

      // Seed the dedup set so incoming socket events for already-loaded msgs are ignored
      seenIdsRef.current.add(id);

      return buildMessage({
        id,
        text: msg.text,
        sender: isMine ? "me" : "other",
        senderName: isMine ? currentUser?.firstName : chatPartner?.firstName,
        avatarUrl: isMine ? currentUser?.photoURL : chatPartner?.photoURL,
        createdAt: msg.createdAt,
      });
    });

    setMessages(loaded);

    if (chatData?.chat?._id) {
      chatIdRef.current = chatData.chat._id;
    }

    // Check if there are older messages to load
    setHasMore(loaded.length === 20);
    setPage(1);
    pageRef.current = 1;
  }, [chatData, currentUserId, chatPartner]);

  // ── Auto-scroll to bottom on new messages ────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Load older messages (scroll-up pagination) ───────────────────────────
  const loadOlderMessages = useCallback(async () => {
    if (!chatIdRef.current || isLoadingOlder || !hasMore) return;

    setIsLoadingOlder(true);
    try {
      const nextPage = pageRef.current + 1;
      const result = await fetchMessages(chatIdRef.current, nextPage);

      if (!result?.messages?.length) {
        setHasMore(false);
        return;
      }

      const older = [...result.messages].reverse().map((msg) => {
        const isMine = msg.sender?.toString() === currentUserId?.toString();
        const id = msg._id;
        seenIdsRef.current.add(id);

        return buildMessage({
          id,
          text: msg.text,
          sender: isMine ? "me" : "other",
          senderName: isMine
            ? currentUser?.firstName
            : chatPartnerRef.current?.firstName,
          avatarUrl: isMine
            ? currentUser?.photoURL
            : chatPartnerRef.current?.photoURL,
          createdAt: msg.createdAt,
        });
      });

      // Prepend older messages without scrolling to bottom
      setMessages((prev) => [...older, ...prev]);
      setHasMore(result.pagination?.hasMore ?? false);
      pageRef.current = nextPage;
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to load older messages:", err);
    } finally {
      setIsLoadingOlder(false);
    }
  }, [isLoadingOlder, hasMore, currentUserId, currentUser]);

  // ── IntersectionObserver: load older when user scrolls to top ────────────
  useEffect(() => {
    const sentinel = messagesTopRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingOlder) {
          loadOlderMessages();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingOlder, loadOlderMessages]);

  // ── Socket setup ─────────────────────────────────────────────────────────
  // FIX: chatData removed from deps — chatIdRef is set in the seed effect first.
  // This prevents the socket from disconnecting/reconnecting every time chatData
  // is refetched by React Query (e.g. window focus, stale-while-revalidate).
  useEffect(() => {
    if (!currentUserId || !chatPartnerId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.off(EVENTS.MESSAGE_RECEIVED);

    socket.on(
      EVENTS.MESSAGE_RECEIVED,
      ({ _id, firstName, text, createdAt }) => {
        // FIX: dedup — ignore message if we've already seeded it from the DB
        // This prevents duplicates when the server replays recent messages on JOIN
        const msgId = _id || `${Date.now()}-${Math.random()}`;
        if (_id && seenIdsRef.current.has(_id)) return;
        seenIdsRef.current.add(msgId);

        setMessages((prev) => [
          ...prev,
          buildMessage({
            id: msgId,
            text,
            sender: "other",
            senderName: firstName,
            avatarUrl: chatPartnerRef.current?.photoURL,
            createdAt,
          }),
        ]);

        // FIX: invalidate sidebar so last-message preview updates in real time
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      },
    );

    // Emit JOIN once chatIdRef is set (ref is set synchronously in seed effect before this runs)
    socket.emit(EVENTS.JOIN_CHAT, {
      receiverId: chatPartnerId,
      ...(chatIdRef.current && { chatId: chatIdRef.current }),
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, chatPartnerId, queryClient]); // stable deps only — no chatData

  // ── Send message ─────────────────────────────────────────────────────────
  const handleSendMessage = () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !socketRef.current) return;

    // Optimistic message gets a temp ID prefixed with "optimistic-"
    // so we can identify and remove/update it on server error if needed
    const optimisticId = `optimistic-${Date.now()}-${Math.random()}`;
    seenIdsRef.current.add(optimisticId); // prevent dedup collision

    socketRef.current.emit(EVENTS.SEND_MESSAGE, {
      receiverId: chatPartnerId,
      text: trimmed,
      ...(chatIdRef.current && { chatId: chatIdRef.current }),
    });

    setMessages((prev) => [
      ...prev,
      buildMessage({
        id: optimisticId,
        text: trimmed,
        sender: "me",
        senderName: currentUser?.firstName,
        avatarUrl: currentUser?.photoURL,
        createdAt: new Date(),
      }),
    ]);

    setMessageInput("");

    // Invalidate sidebar preview for sender side too
    queryClient.invalidateQueries({ queryKey: ["chats"] });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ── Loading / error states ───────────────────────────────────────────────
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

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
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

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm leading-tight text-base-content truncate">
            {chatPartner?.firstName} {chatPartner?.lastName}
          </h2>
          {/* FIX: removed hardcoded "Online" — only show when you have real presence */}
        </div>
      </div>

      {/* ── MESSAGES AREA ── */}
      {/* WHY min-h-0: without it, flex children don't shrink and overflow-y-auto breaks */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 bg-base-100">
        {/* Scroll-up sentinel for IntersectionObserver */}
        <div ref={messagesTopRef} className="h-1" />

        {/* Load older spinner */}
        {isLoadingOlder && (
          <div className="flex justify-center py-2">
            <span className="loading loading-spinner loading-sm text-primary" />
          </div>
        )}

        {/* Load older button fallback */}
        {hasMore && !isLoadingOlder && (
          <div className="flex justify-center">
            <button
              className="btn btn-ghost btn-xs text-base-content/50"
              onClick={loadOlderMessages}
            >
              Load older messages
            </button>
          </div>
        )}

        {/* FIX: only show empty state after loading is done — prevents flash */}
        {!chatLoading && messages.length === 0 && (
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
            <p className="text-base-content/40 text-sm text-center">
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
              className={`flex items-end gap-2 max-w-[75%] sm:max-w-[65%] ${
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
                  className={`px-4 py-2 rounded-2xl text-sm shadow-sm break-words ${
                    msg.sender === "me"
                      ? "bg-primary text-primary-content rounded-br-sm"
                      : "bg-base-200 text-base-content rounded-bl-sm"
                  } ${msg.id?.startsWith("optimistic-") ? "opacity-70" : ""}`}
                  // WHY opacity-70 on optimistic: subtle visual cue that message is in-flight
                >
                  {msg.text}
                </div>

                <div className="text-[10px] mt-1 px-1 opacity-40">
                  {msg.time}
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
            maxLength={2000}
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
