import apiClient from "../apiClient";

export const fetchAllChats = async () => {
  const response = await apiClient.get("chats");
  return response?.data?.data; // unwrap once here
};

export const fetchOrCreateChat = async (targetUserId) => {
  const response = await apiClient.get(`chats/${targetUserId}`);
  return response?.data?.data; // { chat, messages }
};
