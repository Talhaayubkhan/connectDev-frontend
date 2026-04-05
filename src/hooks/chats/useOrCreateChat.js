import { useQuery } from "@tanstack/react-query";
import { fetchOrCreateChat } from "../../services/chats/allChats";

// useOrCreateChat
// Calls GET /chats/user/:targetUserId
// Returns: { chat: { _id, otherUser }, messages: [...] }
//
// staleTime: 30s — avoids re-fetching when switching back to an open chat quickly.
// The socket layer keeps the message list live; React Query only needs to seed it.
export const useOrCreateChat = (targetUserId) => {
  return useQuery({
    queryKey: ["chat", targetUserId],
    queryFn: () => fetchOrCreateChat(targetUserId),
    enabled: !!targetUserId,
  });
};
