import apiClient from "../apiClient";

export const updateProfile = async (data) => {
  // ✅ receives data
  const profile = await apiClient.patch("profile/edit", data);
  return profile.data; // returns unwrapped response
};
