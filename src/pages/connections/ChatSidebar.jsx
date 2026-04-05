import { useNavigate, useParams } from "react-router-dom";
import { DEFAULT_AVATAR, formatTime } from "../../utils/constants";
import { useFetchAllChats } from "../../hooks/chats/useFetchAllChats";

const ChatSidebar = () => {
  const { userId: activeChatPartnerId } = useParams();
  const navigate = useNavigate();

  const { data: chats, isLoading, error } = useFetchAllChats();

  const chatCount = chats?.length ?? 0;

  return (
    <aside className="w-full md:w-80 h-full flex flex-col bg-base-100 border-r border-base-300">
      {/* Header */}
      <div className="px-5 py-4 border-b border-base-300 bg-base-200 shrink-0">
        <h1 className="text-lg font-semibold tracking-tight">Messages</h1>
        {!isLoading && (
          <p className="text-xs text-base-content/50 mt-1">
            {chatCount} conversation{chatCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center text-error text-sm p-4">
            Failed to load chats
          </div>
        )}

        {!isLoading && !error && chatCount === 0 && (
          <div className="flex flex-col items-center justify-center h-60 text-center px-6 gap-2">
            <div className="text-3xl">💬</div>
            <p className="text-sm text-base-content/60">No conversations yet</p>
            <p className="text-xs text-base-content/40">
              Start chatting from connections
            </p>
          </div>
        )}

        {chats?.map((chat) => {
          const isActive =
            activeChatPartnerId === chat.otherUser?._id?.toString();

          return (
            <button
              key={chat._id}
              onClick={() => navigate(`/chat/${chat.otherUser?._id}`)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 border-b border-base-200/60
                ${
                  isActive
                    ? "bg-primary/10 border-l-4 border-l-primary"
                    : "hover:bg-base-200 border-l-4 border-l-transparent"
                }`}
            >
              <div className="relative shrink-0">
                <img
                  src={chat.otherUser?.photoURL || DEFAULT_AVATAR}
                  alt={`${chat.otherUser?.firstName} avatar`}
                  onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-sm font-semibold truncate ${
                      isActive ? "text-primary" : ""
                    }`}
                  >
                    {chat.otherUser?.firstName} {chat.otherUser?.lastName}
                  </span>
                  <span className="text-[10px] text-base-content/40 shrink-0">
                    {formatTime(chat.lastMessage?.createdAt || chat.updatedAt)}
                  </span>
                </div>

                <p className="text-xs text-base-content/60 truncate mt-1">
                  {chat.lastMessage ? (
                    <>
                      {/* isMine flag now comes from the backend — no client-side guessing */}
                      {chat.lastMessage.isMine && (
                        <span className="text-primary font-medium">You: </span>
                      )}
                      {chat.lastMessage.text}
                    </>
                  ) : (
                    <span className="italic opacity-60">No messages yet</span>
                  )}
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
