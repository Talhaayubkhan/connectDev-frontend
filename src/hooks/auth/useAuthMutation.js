import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearUser } from "../../store/features/auth/authSlice";
import { useDispatch } from "react-redux";
import {
  changePassword,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "../../services/auth/userAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      // WHY setQueryData instead of dispatch(setUser)?
      // React Query is now the single source of truth.
      // Setting the cache here means ProtectedRoute, Navbar,
      // ProfilePage — all instantly get the user WITHOUT
      // an extra API call. No flicker, no double fetch.
      queryClient.setQueryData(["profile"], user);
      navigate("/feed", { replace: true });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Login failed. Try again.";
      toast.error(message);
    },
  });
};

export const useSignupMutation = () => {
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
      // WHY clear both?
      // queryClient.clear() wipes ALL cached data (profile, feed, etc.)
      // dispatch(clearUser()) resets Redux (kept for any Redux-dependent logic)
      // Together they ensure zero stale data remains after logout
      dispatch(clearUser());
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate(ROUTES.LOGIN);
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
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed. Please login again.");
      dispatch(clearUser());
      queryClient.clear();
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Password change failed.";
      toast.error(message);
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data) => forgotPassword(data),
    onSuccess: () => {
      toast.success("Reset link sent! Check your inbox.");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    },
  });
};

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => resetPassword(data),
    onSuccess: () => {
      toast.success("Password reset! Please sign in.");
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    },
  });
};
