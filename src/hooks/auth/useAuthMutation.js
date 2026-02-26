import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearUser, setUser } from "../../store/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser } from "../../services/auth/userAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useLoginMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      const userData = response?.data;
      dispatch(setUser(userData));
      toast.success("Login successful!");
      navigate("/");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Login failed. Try again.";
      toast.error(message);
    },
  });
};

export const useLogoutMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: () => {
      toast.error("Logout failed. Please try again.");
    },
  });
};
