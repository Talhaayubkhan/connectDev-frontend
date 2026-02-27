import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchFeedProfiles,
  reviewFeedRequests,
} from "../../services/feed/feedService";
import { toast } from "react-toastify";
import { CONNECTION_KEYS } from "../../utils/constants";
export const useFeedQuery = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      try {
        const res = await fetchFeedProfiles();
        return res.data || [];
      } catch (err) {
        if (err?.response?.status === 404) return [];
        throw err;
      }
    },
  });
};

export const useFeedRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ status, requestId }) =>
      reviewFeedRequests({ status, requestId }),
    onSuccess: (_, variables) => {
      const isInterested = variables.status === "interested";
      if (isInterested) {
        toast.success(`You're interested in ${variables.name}!`);
      } else {
        toast.info(`${variables.name} ignored.`);
      }
      // queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Action failed.");
    },
  });
};
