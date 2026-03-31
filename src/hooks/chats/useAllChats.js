import { useQuery } from "@tanstack/react-query";
import { fetchAllChats } from "../../services/chats/allChats";

export const useAllChats = () => {
  return useQuery({
    queryKey: ["allChats"],
    queryFn: async () => {
      const chats = await fetchAllChats();

      return chats.map((chat) => ({
        chatId: chat._id,
        updatedAt: chat.updatedAt,
        // Guard: lastMessage can be null on a brand new chat
        lastMessage: chat.lastMessage
          ? {
              id: chat.lastMessage._id,
              text: chat.lastMessage.text,
              createdAt: chat.lastMessage.createdAt,
              isMine: chat.lastMessage.isMine,
            }
          : null,
        otherUser: {
          id: chat.otherUser._id,
          firstName: chat.otherUser.firstName,
          lastName: chat.otherUser.lastName,
          photoURL: chat.otherUser.photoURL,
        },
      }));
    },
  });
};
