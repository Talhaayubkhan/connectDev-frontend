import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearUser, setUser } from "../../store/features/auth/authSlice";
import { useDispatch } from "react-redux";
import {
  changePassword,
  loginUser,
  logoutUser,
  registerUser,
} from "../../services/auth/userAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useLoginMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      dispatch(setUser(response));
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

export const useSignupMutation = () => {
  // WHY no dispatch here?
  // Backend returns no token on register — just user data.
  // Without a token we can't authenticate the user in Redux.
  return useMutation({
    mutationFn: registerUser,
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Register failed. Try again.";
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

export const useChangePasswordMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => changePassword(data),
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.clear();
      toast.success(
        "Password changed! Please login again with your new password.",
      );
      navigate("/login");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Password change failed.";
      toast.error(message);
    },
  });
};
