import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateProfile } from "../../services/profile/updateProfileService"; // ✅ fixed typo
import { setUser } from "../../store/features/auth/authSlice";
import { useDispatch } from "react-redux";

export const useProfileUpdateMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: (res) => {
      // console.log("update response:", res); // check this first
      dispatch(setUser(res.data));
      toast.success("Profile updated!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Update failed. Try again.";
      toast.error(message);
    },
  });
};
