import apiClient from "../../services/apiClient";
export const fetchProfile = async () => {
  const response = await apiClient.get("profile/view");
  return response.data;
};
