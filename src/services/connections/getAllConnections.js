import apiClient from "../apiClient";

export const getAllConnections = async () => {
  const response = await apiClient.get("user/connections");
<<<<<<< HEAD
  return response.data?.data || [];
=======
  return response.data;
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
};
