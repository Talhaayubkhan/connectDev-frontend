import axios from "axios";

const configuredBaseURL = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseURL = (configuredBaseURL || "http://localhost:3000").replace(
  /\/+$/,
  "",
);

const apiClient = axios.create({
  baseURL: `${apiBaseURL}/`,
  timeout: 15000,
  withCredentials: true,
});

export default apiClient;
