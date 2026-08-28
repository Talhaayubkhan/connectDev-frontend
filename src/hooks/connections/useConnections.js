import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllConnections } from "../../services/connections/getAllConnections";
import {
  getAllReceivedConnections,
  reviewRequest,
} from "../../services/connections/getAllReceivedRequests";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "../../utils/constants";

export const useConnections = () => {
  return useQuery({
    queryKey: QUERY_KEYS.connections,
    queryFn: async () => {
      try {
        return await getAllConnections();
      } catch (err) {
        if (err?.response?.status === 404) return [];
        throw err;
      }
    },
  });
};

export const useConnectionRequests = () => {
  return useQuery({
    queryKey: QUERY_KEYS.requests,
    queryFn: async () => {
      try {
        return await getAllReceivedConnections();
      } catch (err) {
        if (err?.response?.status === 404) return [];
        throw err;
      }
    },
  });
};

export const useReviewConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ status, requestId }) => reviewRequest({ status, requestId }),
    onSuccess: (_, variables) => {
      const isAccepted = variables.status === "accepted";

      toast.success(isAccepted ? "Connection accepted!" : "Request rejected.");

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.requests });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.connections });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Action failed.");
    },
  });
};
