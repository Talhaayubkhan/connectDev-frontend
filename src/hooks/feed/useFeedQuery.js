import { useQuery } from "@tanstack/react-query";
import { fetchFeedProfiles } from "../../services/feed/feedService";

export const useFeedQuery = () => {
  return useQuery({
    queryKey: ["feedProfiles"],
    queryFn: fetchFeedProfiles,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
