import apiClient from "../apiClient";

export const fetchFeedProfiles = async () => {
  const response = await apiClient.get("/user/feed");
  return response.data; // return full response.data
};

export const reviewFeedRequests = async ({ status, requestId }) => {
  const response = await apiClient.post(`request/send/${status}/${requestId}`);
  return response.data;
};
