import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../../services/profile/fetchProfile";

export const useShowProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
};
