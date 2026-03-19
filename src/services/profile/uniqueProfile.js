// import apiClient from "../../services/apiClient";

// export const getUniqueProfile = async (userId) => {
//   const response = await apiClient.get(`/profile/${userId}`);
//   return response?.data?.data;
// };

// services/profile/uniqueProfile.js

import apiClient from "../../services/apiClient";

export const getUniqueProfile = async (userId) => {
  if (!userId) throw new Error("userId is required");
  const response = await apiClient.get(`/profile/${userId}`);
  return response?.data?.data;
};
