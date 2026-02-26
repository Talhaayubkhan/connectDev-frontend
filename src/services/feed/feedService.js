import apiClient from "../apiClient";

export const fetchFeedProfiles = async () => {
  const { data } = await apiClient.get("/user/feed");
  return data.data;
};
