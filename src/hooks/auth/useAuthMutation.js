import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { QUERY_KEYS, ROUTES } from "../../utils/constants";
import { getErrorMessage } from "../../services/apiError";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      queryClient.setQueryData(QUERY_KEYS.profile, user);
      navigate(ROUTES.FEED, { replace: true });
    },
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: () => {
      toast.error("Logout failed. Please try again.");
    },
  });
};

export const useChangePasswordMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed. Please login again.");
      queryClient.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Password change failed."));
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
      toast.error(getErrorMessage(error, "Something went wrong. Try again."));
    },
  });
};

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => resetPassword(data),
    onSuccess: () => {
      toast.success("Password reset! Please sign in.");
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Something went wrong. Try again."));
    },
  });
};
