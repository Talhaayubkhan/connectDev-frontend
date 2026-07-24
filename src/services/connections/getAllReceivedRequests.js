import apiClient from "../apiClient";

export const getAllReceivedConnections = async () => {
  const response = await apiClient.get("user/requests/received");
  // const eachRequest = response.map((req) => {
  //   if (req.status === "interested") return req;
  // });
  // console.log("All recieved request", response?.data?.results);

  return response?.data?.results;
};

export const reviewRequest = async ({ status, requestId }) => {
  const response = await apiClient.post(
    `request/review/${status}/${requestId}`,
    {},
  );
  return response.data;
};
