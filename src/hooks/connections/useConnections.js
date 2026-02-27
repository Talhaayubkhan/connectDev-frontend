import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllConnections } from "../../services/connections/getAllConnections";
import {
  getAllReceivedConnections,
  reviewRequest,
} from "../../services/connections/getAllReceivedRequests";
import { toast } from "react-toastify";
import { CONNECTION_KEYS } from "../../utils/constants";

// 1. Fetch all connections
export const useConnections = () => {
  return useQuery({
    queryKey: CONNECTION_KEYS.connections,
    queryFn: async () => {
      try {
        const res = await getAllConnections();
        return res?.data || [];
      } catch (err) {
        if (err?.response?.status === 404) return [];
        throw err;
      }
    },
  });
};

// 2. Fetch all received connection requests
export const useConnectionRequests = () => {
  return useQuery({
    queryKey: CONNECTION_KEYS.requests,
    queryFn: async () => {
      try {
        const res = await getAllReceivedConnections();
        return res?.data || [];
      } catch (err) {
        if (err?.response?.status === 404) return [];
        throw err;
      }
    },
  });
};

// 3. Accept or reject a connection request
export const useReviewConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ status, requestId }) => reviewRequest({ status, requestId }),
    onSuccess: (_, variables) => {
      const isAccepted = variables.status === "accepted";

      toast.success(isAccepted ? "Connection accepted!" : "Request rejected.");

      // invalidate both — request leaves requests list, may join connections
      queryClient.invalidateQueries({ queryKey: CONNECTION_KEYS.requests });
      queryClient.invalidateQueries({ queryKey: CONNECTION_KEYS.connections });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Action failed.");
    },
  });
};
