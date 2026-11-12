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

export const AUTH_MODE = {
  LOGIN: "login",
  REGISTER: "register",
};

export const LOGIN_INITIAL_VALUES = {
  email: "",
  password: "",
};

export const REGISTER_INITIAL_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const FEATURES = [
  "Real-time chat and collaboration",
  "Project discovery and team matching",
  "Knowledge sharing and mentorship",
];

export const STATS = [
  { value: "5K+", label: "Active Members" },
  { value: "200+", label: "Projects" },
  { value: "50+", label: "Countries" },
];
