import apiClient from "../apiClient";

export const updateProfile = async (data) => {
  const profile = await apiClient.patch("profile/edit", data);
  return profile.data;
};
