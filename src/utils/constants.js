export const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

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
// export const API_URL = { BASE_URL };
