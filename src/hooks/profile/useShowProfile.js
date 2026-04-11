import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../../services/profile/fetchCurrentUser";

export const useShowProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // WHY: Don't refetch if data is < 5min old
    retry: false, // WHY: If 401, don't hammer the server
    refetchOnWindowFocus: false, // WHY: Don't refetch just because user switches tabs
  });
};
