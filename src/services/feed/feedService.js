import apiClient from "../apiClient";

export const fetchFeedProfiles = async () => {
  const response = await apiClient.get("/user/feed");
  const { data: users, hasNextPage, page, limit } = response.data;

  return {
    users: users || [],
    hasNextPage,
    page,
    limit,
  };
};

export const reviewFeedRequests = async ({ status, requestId }) => {
  const response = await apiClient.post(`request/send/${status}/${requestId}`);
  return response.data;
};
