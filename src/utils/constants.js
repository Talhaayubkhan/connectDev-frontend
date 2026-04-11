// ─────────────────────────────────────────────────────────────
// WHY .env for BASE_URL:
// Hardcoding localhost means you must manually change this
// before every production deploy — and you will forget.
// .env.local = local dev, .env.production = prod build.
// Vite automatically picks the right one.
// ─────────────────────────────────────────────────────────────
export const BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3000";

// ─────────────────────────────────────────────────────────────
// ASSETS
// ─────────────────────────────────────────────────────────────

// WHY a fallback avatar:
// If photoURL is missing, broken, or an invalid URL, the img
// onError handler falls back to this. DiceBear gives a
// consistent illustrated avatar instead of a broken image icon.
export const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/thumbs/svg?seed=default";

// ─────────────────────────────────────────────────────────────
// ROUTES
// WHY centralise routes:
// If you rename /auth/login to /login one day, you change it
// here and every navigate() call updates automatically.
// ─────────────────────────────────────────────────────────────
export const ROUTES = {
  LOGIN: "/auth/login",
  FEED: "/feed",
  PROFILE: "/profile",
  CONNECTIONS: "/connections",
  REQUESTS: "/requests",
  CHAT: "/chat",
};

// ─────────────────────────────────────────────────────────────
// NAVIGATION
// WHY not hardcode paths in JSX:
// navLinks uses ROUTES so a path rename stays in sync.
// ─────────────────────────────────────────────────────────────
export const navLinks = [
  { to: ROUTES.FEED, label: "Feed" },
  { to: ROUTES.CONNECTIONS, label: "Connections" },
  { to: ROUTES.REQUESTS, label: "Requests" },
];

// ─────────────────────────────────────────────────────────────
// QUERY KEYS
// WHY centralise all query keys together:
// React Query matches keys by deep equality. ["profile"] typed
// in one file and ["Profile"] in another are different keys —
// invalidateQueries silently does nothing. One source of truth
// prevents that entire class of bug.
// ─────────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  profile: ["profile"],
  connections: ["connections"],
  requests: ["requests"],
  feed: ["feed"],
};

// Keep this for backward compatibility if you use CONNECTION_KEYS elsewhere.
// WHY: Renaming it everywhere at once is risky — do it gradually.
// Once you replace all usages with QUERY_KEYS, delete this.
export const CONNECTION_KEYS = QUERY_KEYS;

// ─────────────────────────────────────────────────────────────
// FORM OPTIONS
// ─────────────────────────────────────────────────────────────
export const GENDER_OPTIONS = [
  { value: "", label: "Select gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// ─────────────────────────────────────────────────────────────
// SOCKET / REAL-TIME EVENTS
// WHY centralise event names:
// A typo in a socket event name ("joinChat" vs "JoinChat")
// means the event never fires and you get no error — just silence.
// One place to define them eliminates that.
// ─────────────────────────────────────────────────────────────
export const EVENTS = {
  JOIN_CHAT: "joinChat",
  SEND_MESSAGE: "sendMessage",
  MESSAGE_RECEIVED: "messageReceived",
};

// ─────────────────────────────────────────────────────────────
// TIME FORMATTERS
// WHY two separate functions:
// formatLastSeen  → relative label for presence ("2h ago", "Just now")
//                   used in navbar, profile cards
// formatTime      → compact label for chat timestamps ("2m", "Yesterday")
//                   used inside chat message lists
// They look similar but serve different UI contexts.
// Merging them into one would require an ugly `mode` parameter.
// ─────────────────────────────────────────────────────────────

export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "Offline";

  const diff = Date.now() - new Date(lastSeen).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
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
