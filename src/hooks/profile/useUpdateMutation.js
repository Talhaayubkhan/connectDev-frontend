import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateProfile } from "../../services/profile/updateProfileService";
import { QUERY_KEYS } from "../../utils/constants";
import { getErrorMessage } from "../../services/apiError";

export const useProfileUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
      toast.success("Profile updated successfully!");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Update failed. Try again."));
    },
  });
};
