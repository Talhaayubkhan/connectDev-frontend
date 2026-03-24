import apiClient from "../apiClient";

export const loginUser = async ({ email, password }) => {
  const response = await apiClient.post("auth/login", { email, password });
  return response.data;
};

export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
}) => {
  const response = await apiClient.post("auth/signup", {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  });

  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("auth/logout");
  return response.data;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await apiClient.patch("/profile/changePassword", {
    currentPassword,
    newPassword,
  });

  return response.data;
};

export const forgotPassword = async ({ email }) => {
  const response = await apiClient.post("auth/forgot-password", { email });
  console.log(response?.data);
  return response.data;
};

export const resetPassword = async ({
  token,
  newPassword,
  confirmPassword,
}) => {
  const response = await apiClient.patch("auth/reset-password", {
    token,
    newPassword,
    confirmPassword,
  });
  console.log(response?.data?.data);

  return response?.data?.data;
};
