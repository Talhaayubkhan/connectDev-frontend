import axios from "axios";
import { BASE_URL } from "../utils/constants";

const apiClient = axios.create({
  baseURL: `${BASE_URL}/`,
  withCredentials: true, // to send cookies with every request
});

export default apiClient;
