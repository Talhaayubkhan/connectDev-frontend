const GENERIC_AXIOS_MESSAGE = /^Request failed with status code \d+$/;

export const getErrorMessage = (error, fallback) => {
  const responseMessage = error?.response?.data?.message;
  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage.trim();
  }

  const runtimeMessage = error?.message;
  if (
    typeof runtimeMessage === "string" &&
    runtimeMessage.trim() &&
    !GENERIC_AXIOS_MESSAGE.test(runtimeMessage.trim())
  ) {
    return runtimeMessage.trim();
  }

  return fallback;
};
