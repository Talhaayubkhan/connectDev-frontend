import { useQuery } from "@tanstack/react-query";
import { getUniqueProfile } from "../../services/profile/uniqueProfile";
import { QUERY_KEYS } from "../../utils/constants";

export const useUniqueProfile = (userId) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.profile, "unique", userId],
    queryFn: () => getUniqueProfile(userId),

    enabled: !!userId && typeof userId === "string",

    retry: (failureCount, error) => {
      const status = error?.response?.status;
      if (status >= 400 && status < 500) return false;
      return failureCount < 2;
    },

    select: (data) => ({
      ...data,
      fullName: `${data.firstName} ${data.lastName}`,
    }),
  });
};
