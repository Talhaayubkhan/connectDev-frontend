import { useQuery } from "@tanstack/react-query";
import { fetchAllChats } from "../../services/chats/allChats";

export const useFetchAllChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: fetchAllChats,
  });
};
