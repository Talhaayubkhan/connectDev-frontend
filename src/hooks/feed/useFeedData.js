import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchFeedProfiles,
  reviewFeedRequests,
} from "../../services/feed/feedService";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "../../utils/constants";
import { getErrorMessage } from "../../services/apiError";

export const useFeedQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.feed,
    queryFn: async () => {
      try {
        const result = await fetchFeedProfiles();
        return result;
      } catch (err) {
        if (err?.response?.status === 404)
          return { users: [], hasNextPage: false };
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
      queryClient.setQueryData(QUERY_KEYS.feed, (oldData) => {
        if (!oldData) return { users: [], hasNextPage: false };
        return {
          ...oldData,
          users: oldData.users.filter(
            (profile) => profile._id !== variables.requestId,
          ),
        };
      });

      const isInterested = variables.status === "interested";
      if (isInterested) {
        toast.success(`Connection request sent to ${variables.name}!`);
      } else {
        toast.info(`${variables.name} skipped.`);
      }
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Action failed."));
    },
  });
};
