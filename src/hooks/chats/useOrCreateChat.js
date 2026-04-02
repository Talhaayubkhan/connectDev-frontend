import { useQuery } from "@tanstack/react-query";
import { fetchOrCreateChat } from "../../services/chats/allChats";

// ─────────────────────────────────────────────
//  useOrCreateChat
//
//  Calls GET /chats/user/:targetUserId
//  Returns: { chat: { _id, otherUser, lastMessage }, messages: [...] }
//
//  WHY `enabled: !!targetUserId`?
//  → Don't run the query until we actually have a userId
//  → Prevents a request with undefined in the URL
// ─────────────────────────────────────────────

export const useOrCreateChat = (targetUserId) => {
  return useQuery({
    queryKey: ["chat", targetUserId],
    queryFn: () => fetchOrCreateChat(targetUserId),
    enabled: !!targetUserId,
    staleTime: 1000 * 60 * 2, // treat data as fresh for 2 minutes
  });
};
