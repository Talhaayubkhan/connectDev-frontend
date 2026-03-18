import apiClient from "../../services/apiClient";

export const getUniqueProfile = async (userId) => {
  const response = await apiClient.get(`/profile/${userId}`);
  return response?.data?.data;
};
