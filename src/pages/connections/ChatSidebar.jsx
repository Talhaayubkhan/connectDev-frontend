import { useNavigate, useParams } from "react-router-dom";
import { useOrCreateChat } from "../../hooks/chats/useOrCreateChat";
import { DEFAULT_AVATAR } from "../../utils/constants";

const ChatSidebar = () => {
  const { userId: activeChatPartnerId } = useParams();
  const navigate = useNavigate();
  const { data: chats = [], isLoading, error } = useOrCreateChat();

  // Format timestamp to human-readable "2h ago", "Yesterday", etc.
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <aside className="w-80 shrink-0 h-full flex flex-col bg-base-100 border-r border-base-300">
      {/* Header */}
      <div className="px-5 py-4 border-b border-base-300 bg-base-200">
        <h1 className="text-lg font-bold text-base-content tracking-tight">
          Messages
        </h1>
        <p className="text-xs text-base-content/40 mt-0.5">
          {chats.length} conversation{chats.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-error text-sm">
            Could not load chats
          </div>
        )}

        {!isLoading && !error && chats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 px-6 text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center text-2xl">
              💬
            </div>
            <p className="text-sm text-base-content/50">No conversations yet</p>
            <p className="text-xs text-base-content/30">
              Go to Connections and message someone
            </p>
          </div>
        )}

        {chats.map((chat) => {
          const isActive = activeChatPartnerId === chat.otherUser?.id;

          return (
            <button
              key={chat.chatId}
              onClick={() => navigate(`/chat/${chat.otherUser?.id}`)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 text-left border-b border-base-200/60
                ${
                  isActive
                    ? "bg-primary/10 border-l-4 border-l-primary"
                    : "hover:bg-base-200 border-l-4 border-l-transparent"
                }`}
            >
              {/* Avatar */}
              <div className="avatar shrink-0">
                <div className="w-11 h-11 rounded-full ring-2 ring-offset-1 ring-offset-base-100 ring-primary/20 overflow-hidden">
                  <img
                    src={chat.otherUser?.photoURL || DEFAULT_AVATAR}
                    alt={chat.otherUser?.firstName}
                    onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                  />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-sm font-semibold truncate ${
                      isActive ? "text-primary" : "text-base-content"
                    }`}
                  >
                    {chat.otherUser?.firstName} {chat.otherUser?.lastName}
                  </span>
                  <span className="text-[10px] text-base-content/40 shrink-0">
                    {formatTime(chat.lastMessage?.createdAt || chat.updatedAt)}
                  </span>
                </div>

                <p className="text-xs text-base-content/50 truncate mt-0.5">
                  {chat.lastMessage
                    ? `${chat.lastMessage.isMine ? "You: " : ""}${chat.lastMessage.text}`
                    : "No messages yet"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default ChatSidebar;
