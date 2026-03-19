// import apiClient from "../../services/apiClient";

// export const getUniqueProfile = async (userId) => {
//   const response = await apiClient.get(`/profile/${userId}`);
//   return response?.data?.data;
// };

// services/profile/uniqueProfile.js

import apiClient from "../../services/apiClient";

export const getUniqueProfile = async (userId) => {
  // WHY validate here too, not just in the hook?
  // This service function is a plain async function — anyone can import and
  // call it directly, not just the hook. Validating here means it's safe
  // regardless of where it's called from.
  if (!userId) throw new Error("userId is required");

  const response = await apiClient.get(`/profile/${userId}`);

  // WHY response?.data?.data and not just response.data?
  // Your backend wraps the payload: { success: true, data: user }
  // So response.data is { success, data } and response.data.data is the user.
  // The optional chaining (?.) is good — keeps it safe if the shape ever
  // changes and returns undefined instead of crashing.
  return response?.data?.data;
};
