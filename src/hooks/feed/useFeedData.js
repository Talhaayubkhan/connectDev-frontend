import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchFeedProfiles,
  reviewFeedRequests,
} from "../../services/feed/feedService";
import { toast } from "react-toastify";

export const useFeedQuery = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      try {
        const result = await fetchFeedProfiles();
        // WHY return whole result and not just users?
        // We need hasNextPage for future pagination.
        // Cache stores { users: [...], hasNextPage, page, limit }
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
      // WHY setQueryData instead of invalidateQueries?
      // invalidateQueries = refetch entire feed → array rebuilds → counter resets
      // setQueryData = remove just acted-on profile from cache → no refetch → smooth
      queryClient.setQueryData(["feed"], (oldData) => {
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
      toast.error(error?.response?.data?.message || "Action failed.");
    },
  });
};
