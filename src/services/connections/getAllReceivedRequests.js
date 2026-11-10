import apiClient from "../apiClient";

export const getAllReceivedConnections = async () => {
  const response = await apiClient.get("user/requests/received");
<<<<<<< HEAD
  return response.data?.results || [];
=======
  return response?.data?.results;
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
};

export const reviewRequest = async ({ status, requestId }) => {
  const response = await apiClient.post(
    `request/review/${status}/${requestId}`,
    {},
  );
  return response.data;
};
