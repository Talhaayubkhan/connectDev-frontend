import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../../services/profile/fetchCurrentUser";
import { QUERY_KEYS } from "../../utils/constants";

export const useShowProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: fetchCurrentUser,
  });
};
