import { io } from "socket.io-client";
import { BASE_URL } from "./constants";
import Cookies from "js-cookie";

let socket;

export const createSocketConnection = () => {
  // ✅ Cookies.get() works now since you removed httpOnly
  // If you ever re-enable httpOnly, switch to: localStorage.getItem("token")
  const token = Cookies.get("token");

  if (!socket) {
    socket = io(BASE_URL, {
      auth: { token },
    });
  }

  return socket;
};
