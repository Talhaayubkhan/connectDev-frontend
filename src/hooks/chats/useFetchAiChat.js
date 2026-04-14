import { useMutation } from "@tanstack/react-query";
import { fetchAiChat } from "../../services/chats/allChats";

export const useFetchAiChat = () => {
  return useMutation({
    mutationFn: (messages) => fetchAiChat(messages),
  });
};
