import apiClient from "../apiClient";

// ── GET /chats ──────────────────────────────────────────────────────────────
// Returns array of all your chats for the sidebar
// Shape per item: { _id, otherUser, lastMessage: { text, isMine, createdAt }, updatedAt }
export const fetchAllChats = async () => {
  const response = await apiClient.get("chats");
  return response?.data?.data ?? [];
};

// ── GET /chats/user/:targetUserId ────────────────────────────────────────────
// Returns or creates a chat with that user + last 20 messages
// Shape: { chat: { _id, otherUser, updatedAt }, messages: [...] }
export const fetchOrCreateChat = async (targetUserId) => {
  const response = await apiClient.get(`chats/user/${targetUserId}`);
  return response?.data?.data;
};

// ── GET /chats/:chatId/messages?page=N&limit=20 ──────────────────────────────
// Paginated older messages (scroll-up infinite load)
// Returns: { messages: [...], pagination: { page, limit, total, hasMore } }
export const fetchMessages = async (chatId, page = 1, limit = 20) => {
  const response = await apiClient.get(
    `chats/${chatId}/messages?page=${page}&limit=${limit}`,
  );
  return response?.data?.data;
};
