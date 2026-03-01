import apiClient from "../apiClient";

export const fetchFeedProfiles = async () => {
  const response = await apiClient.get("/user/feed");
  // WHY destructure here?
  // Backend returns: { success, page, limit, results, hasNextPage, data: [...users] }
  // We extract what frontend actually needs — users array + pagination info.
  // Keeps the hook clean — it just receives structured data, not raw response.
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
