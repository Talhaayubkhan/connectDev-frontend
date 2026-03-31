import { useQuery } from "@tanstack/react-query";
import { fetchOrCreateChat } from "../../services/chats/allChats";

export const useGetOrCreateChat = (targetUserId) => {
  return useQuery({
    queryKey: ["chat", targetUserId],
    queryFn: () => fetchOrCreateChat(targetUserId),
    enabled: !!targetUserId, // don't run if no id yet
  });
};
