import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearUser, setUser } from "../../store/features/auth/authSlice";
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
    mutationFn: (data) => changePassword(data),
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.clear();
      toast.success(
        "Password changed! Please login again with your new password.",
      );
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
      // WHY this matters?
      // This is where cooldown error shows — backend throws
      // "Reset email already sent. Please wait 1 minute..."
      // That message comes through here automatically.
      const message =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    },
  });
};
export const useResetPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => resetPassword(data), // ✅ fixed
    onSuccess: () => {
      toast.success("Password reset! Please sign in."); // ✅ your correct answer
      navigate(ROUTES.LOGIN); // ✅ your correct answer
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    },
  });
};
