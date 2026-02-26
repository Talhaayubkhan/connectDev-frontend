import apiClient from "../apiClient";

export const getAllConnections = async () => {
  const response = await apiClient.get("user/connections");
  // console.log(response);

  return response.data;
};
