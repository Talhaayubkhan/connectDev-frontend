import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateProfile } from "../../services/profile/updateProfileService";

export const useProfileUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // WHY: The `return` keyword was missing before.
    // Without return, mutationFn returns undefined.
    // onSuccess(res) receives undefined → res.data crashes silently.
    mutationFn: (data) => updateProfile(data),

    onSuccess: () => {
      // WHY invalidateQueries instead of dispatch(setUser)?
      // invalidateQueries marks ["profile"] as stale and triggers
      // a fresh fetch from the server. This means:
      // 1. Navbar auto-updates with new name/photo
      // 2. ProfilePage auto-updates
      // 3. You don't manually stitch together response data
      // The server is the source of truth — trust it.
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || "Update failed. Try again.";
      toast.error(message);
    },
  });
};
