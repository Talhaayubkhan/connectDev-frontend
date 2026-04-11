import apiClient from "../apiClient";

export const updateProfile = async (data) => {
  const profile = await apiClient.patch("profile/edit", data);
  console.log("profile data", profile.data);

  return profile.data; // returns { data: updatedUser, message: "..." }
};
