import apiClient from "../apiClient";

export const fetchCurrentUser = async () => {
  const response = await apiClient.get("profile/view");

  return response?.data?.data;
};
