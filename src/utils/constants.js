// export const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
export const BASE_URL = "http://localhost:3000";

// ✅ Fallback avatar when photoURL is missing
export const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/thumbs/svg?seed=default";

export const GENDER_OPTIONS = [
  // ✅ descriptive name — it's specifically gender
  { value: "", label: "Select gender" }, // placeholder, empty value
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// ── Query keys in one place so no typo mismatches ──────────────────────────
// This is important — if you type ["request"] in one place and ["requests"]
// in another, invalidateQueries won't work. Centralizing prevents that bug.
export const CONNECTION_KEYS = {
  connections: ["connections"],
  requests: ["requests"],
};

export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "Offline";

  const diff = Date.now() - new Date(lastSeen).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const ROUTES = {
  LOGIN: "/auth/login",
  CHAT: "/chat",
};

export const navLinks = [
  { to: "/", label: "Feed" },
  { to: "/connections", label: "Connections" },
  { to: "/requests", label: "Requests" },
];

export const EVENTS = {
  JOIN_CHAT: "joinChat",
  SEND_MESSAGE: "sendMessage",
  MESSAGE_RECEIVED: "messageReceived",
};

export const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

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

// export const API_URL = { BASE_URL };
