import { createSlice } from "@reduxjs/toolkit";

// WHY keep Redux at all if React Query is the source of truth?
// Redux is still useful for:
// 1. Logout coordination (clearUser signals all Redux-dependent code)
// 2. Future non-server state (theme, sidebar open/close, etc.)
// 3. Any state that doesn't come from an API
const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
