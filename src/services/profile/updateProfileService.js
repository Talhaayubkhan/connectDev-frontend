import apiClient from "../apiClient";

export const updateProfile = async (data) => {
  const profile = await apiClient.patch("profile/edit", data);
<<<<<<< HEAD
=======

>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
  return profile.data;
};
