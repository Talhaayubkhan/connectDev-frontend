import axios from "axios";

const configuredBaseURL = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseURL = (configuredBaseURL || "http://localhost:3000").replace(
  /\/+$/,
  "",
);

const apiClient = axios.create({
<<<<<<< HEAD
  baseURL: `${apiBaseURL}/`,
  timeout: 15000,
=======
  baseURL: `${BASE_URL}/`,
>>>>>>> a489968 (fix: update frontend code overall and remove bugs)
  withCredentials: true,
});

export default apiClient;
