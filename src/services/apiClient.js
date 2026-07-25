import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Prefer the documented variable while keeping existing local environments working.
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || BASE_URL;

const apiClient = axios.create({
  baseURL: `${apiBaseURL}/`,
  withCredentials: true, // to send cookies with every request
});

export default apiClient;
