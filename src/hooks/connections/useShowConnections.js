import { useQuery } from "@tanstack/react-query";
import { getAllConnections } from "../../services/connections/getAllConnections";

export const useShowConnections = () => {
  return useQuery({
    queryKey: ["connections"],
    queryFn: getAllConnections,
    refetchOnWindowFocus: false, // ✅ don't refetch on tab switch
  });
};
