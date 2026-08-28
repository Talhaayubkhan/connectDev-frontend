export const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/thumbs/svg?seed=default";

export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  LOGIN: "/auth/login",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  FEED: "/feed",
  PROFILE: "/profile",
  CONNECTIONS: "/connections",
  REQUESTS: "/requests",
};

export const navLinks = [
  { to: ROUTES.FEED, label: "Feed" },
  { to: ROUTES.CONNECTIONS, label: "Connections" },
  { to: ROUTES.REQUESTS, label: "Requests" },
];

// Shared keys prevent cache updates from silently targeting a different query.
export const QUERY_KEYS = {
  profile: ["profile"],
  connections: ["connections"],
  requests: ["requests"],
  feed: ["feed"],
};

export const GENDER_OPTIONS = [
  { value: "", label: "Select gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "Offline";

  const timestamp = new Date(lastSeen).getTime();
  if (Number.isNaN(timestamp)) return "Offline";

  const diff = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
};
