import apiClient from "../apiClient";

export const loginUser = async ({ email, password }) => {
  const response = await apiClient.post("auth/login", { email, password });

  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("auth/logout");
  return response.data;
};
