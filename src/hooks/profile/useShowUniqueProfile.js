import { useQuery } from "@tanstack/react-query";
import { getUniqueProfile } from "../../services/profile/uniqueProfile";

export const useUniqueProfile = (userId) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUniqueProfile(userId),
    enabled: !!userId,
  });
};
