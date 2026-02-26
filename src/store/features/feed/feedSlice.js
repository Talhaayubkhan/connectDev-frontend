import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feed: null,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    getFeed: (state, action) => {
      state.feed = action.payload;
    },
    emptyFeed: (state) => {
      state.feed = null;
    },
  },
});

export const { getFeed, emptyFeed } = feedSlice.actions;
export default feedSlice.reducer;
