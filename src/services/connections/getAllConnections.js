import apiClient from "../apiClient";

export const getAllConnections = async () => {
  const response = await apiClient.get("user/connections");
  return response.data?.data || [];
};
