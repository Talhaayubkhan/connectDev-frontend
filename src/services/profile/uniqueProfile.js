import apiClient from "../../services/apiClient";

export const getUniqueProfile = async (userId) => {
  if (!userId || typeof userId !== "string") {
    throw new Error("Valid userId required");
  }

  const { data } = await apiClient.get(`/profile/${userId}`);
  return data.data;
};
