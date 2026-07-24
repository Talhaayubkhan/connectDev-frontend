import apiClient from "../apiClient";

export const getAllReceivedConnections = async () => {
  const response = await apiClient.get("user/requests/received");
  //   console.log(response);

  return response.data;
};

export const reviewRequest = async ({ status, requestId }) => {
  const response = await apiClient.post(
    `request/review/${status}/${requestId}`,
    {},
  );
  console.log("Requesst Data", response?.data);
  return response.data;
};
