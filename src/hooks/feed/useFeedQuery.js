import { useQuery } from "@tanstack/react-query";
import { fetchFeedProfiles } from "../../services/feed/feedService";

export const useFeedQuery = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      try {
        const res = await fetchFeedProfiles();
        return res || [];
      } catch (err) {
        if (err?.response?.status === 404) return [];
        throw err;
      }
    },
  });
};
