import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../../services/profile/fetchCurrentUser";

export const useShowProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchCurrentUser,
  });
};
