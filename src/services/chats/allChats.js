import apiClient from "../apiClient";

// ── GET /chats ──────────────────────────────
// Returns array of all your chats (for the sidebar)
// Each item has: { _id, otherUser, lastMessage, updatedAt }
export const fetchAllChats = async () => {
  const response = await apiClient.get("chats");
  return response?.data?.data; // unwrap: { success, count, data: [...] } → [...]
};

// ── GET /chats/user/:targetUserId ────────────
// Returns or creates a chat with that user
// Also returns last 20 messages for that chat
// Shape: { chat: { _id, otherUser, lastMessage }, messages: [...] }
export const fetchOrCreateChat = async (targetUserId) => {
  // WHY "chats/user/" prefix?
  // Your route is: GET /chats/user/:targetUserId
  // Without "user/" → hits /chats/:chatId/messages route instead → WRONG
  const response = await apiClient.get(`chats/user/${targetUserId}`);
  return response?.data?.data; // { chat, messages }
};

// ── GET /chats/:chatId/messages?page=N ───────
// Used for scroll-up pagination (load older messages)
export const fetchMessages = async (chatId, page = 1, limit = 20) => {
  const response = await apiClient.get(
    `chats/${chatId}/messages?page=${page}&limit=${limit}`,
  );
  return response?.data?.data; // array of message objects
};
