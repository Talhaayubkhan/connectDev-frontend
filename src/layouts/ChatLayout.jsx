import { Outlet, useParams } from "react-router-dom";
import ChatSidebar from "../pages/connections/ChatSidebar";

// WHY: On mobile we want EITHER sidebar OR chat visible, not both.
// We use CSS to hide/show based on whether a userId is in the URL.

const ChatLayout = () => {
  const { userId } = useParams();

  return (
    // Removed fixed px-3 mt-6 wrapper — let it fill available space
    // Added min-h-0 so flex children can scroll correctly inside flex parent
    <div className="flex justify-center px-2 sm:px-4 mt-4 sm:mt-6">
      <div
        className="w-full max-w-5xl flex bg-base-100 shadow-xl rounded-2xl border border-base-300 overflow-hidden"
        style={{ height: "calc(100dvh - 80px)" }}
        // WHY dvh not vh: dvh accounts for mobile browser address bar
      >
        {/* 
          RESPONSIVE STRATEGY:
          - Mobile: sidebar fills screen when no chat open; hidden when chat open
          - Desktop: both sidebar and chat panel side by side always
          
          We use conditional classes based on userId presence
        */}
        <div
          className={`
          ${userId ? "hidden md:flex" : "flex w-full md:w-80"}
          md:w-80 h-full
        `}
        >
          <ChatSidebar />
        </div>

        {/* Right panel */}
        {userId ? (
          <div className="flex-1 flex flex-col min-h-0 min-w-0">
            <Outlet />
          </div>
        ) : (
          // Only shown on desktop — on mobile, sidebar takes full width above
          <div className="hidden md:flex flex-1 flex-col items-center justify-center gap-3 bg-base-100">
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
