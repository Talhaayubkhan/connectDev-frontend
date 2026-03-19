// import { useQuery } from "@tanstack/react-query";
// import { getUniqueProfile } from "../../services/profile/uniqueProfile";

// export const useUniqueProfile = (userId) => {
//   return useQuery({
//     queryKey: ["profile", userId],
//     queryFn: () => getUniqueProfile(userId),
//     enabled: !!userId,
//   });
// };

// hooks/profile/useShowUniqueProfile.js

import { useQuery } from "@tanstack/react-query";
import { getUniqueProfile } from "../../services/profile/uniqueProfile";

export const useUniqueProfile = (userId) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUniqueProfile(userId),

    // WHY !!userId && typeof userId === "string"?
    // !!userId alone allows the literal string "undefined" or "null" to pass
    // through (broken route param). Adding the type check ensures the query
    // only fires when userId is a real non-empty string.
    enabled: !!userId && typeof userId === "string",

    // WHY retry: false / custom retry?
    // React Query retries 3 times by default. For 4xx errors (403 not connected,
    // 404 not found, 400 bad ID) retrying is pointless — the answer won't
    // change. Only retry on 5xx (server errors) where a retry might succeed.
    retry: (failureCount, error) => {
      const status = error?.response?.status;
      if (status >= 400 && status < 500) return false; // never retry 4xx
      return failureCount < 2; // retry up to 2x for 5xx
    },
  });
};
