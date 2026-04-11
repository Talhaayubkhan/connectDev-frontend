// utils/chatHelpers.js
import { DEFAULT_AVATAR } from "./constants";

// WHY here and not constants.js:
// Constants are static values that never change at runtime.
// buildMessage is a function that transforms data — it is a
// helper, not a constant. Mixing helpers into constants makes
// the file do two different jobs.
export const buildMessage = ({
  id,
  text,
  sender,
  senderName,
  avatarUrl,
  createdAt,
}) => ({
  id,
  text,
  sender,
  senderName,
  avatarUrl: avatarUrl || DEFAULT_AVATAR,
  time: new Date(createdAt || Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
});
