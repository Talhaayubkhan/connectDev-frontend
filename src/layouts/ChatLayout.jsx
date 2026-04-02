import { Outlet, useParams } from "react-router-dom";
import ChatSidebar from "../pages/connections/ChatSidebar";
// ─────────────────────────────────────────────
//  ChatLayout
//
//  Renders:
//    [ ChatSidebar ] [ <Outlet /> ]
//
//  When URL is /chat        → Outlet = empty (just sidebar shown)
//  When URL is /chat/:userId → Outlet = ChatWindow for that user
//
//  WHY a layout component?
//  → Keeps sidebar always visible while only the right panel changes
//  → Avoids re-mounting sidebar on every navigation between chats
//  → Clean separation: routing handles which chat is open
// ─────────────────────────────────────────────

const ChatLayout = () => {
  const { userId } = useParams();

  return (
    <div className="flex justify-center px-3 mt-6">
      <div className="w-full max-w-5xl h-[85vh] flex bg-base-100 shadow-xl rounded-2xl border border-base-300 overflow-hidden">
        {/* ── SIDEBAR (always visible) ── */}
        <ChatSidebar />

        {/* ── RIGHT PANEL ── */}
        {userId ? (
          // A conversation is selected → render it
          <Outlet />
        ) : (
          // No conversation selected → empty state
          <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-base-100">
            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center text-3xl">
              💬
            </div>
            <p className="text-base-content/50 text-sm font-medium">
              Select a conversation to start messaging
            </p>
            <p className="text-base-content/30 text-xs">
              Your chats are listed on the left
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
