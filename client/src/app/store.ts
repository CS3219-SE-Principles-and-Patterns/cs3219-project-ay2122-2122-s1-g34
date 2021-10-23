import { configureStore } from "@reduxjs/toolkit";

import userReducer from "features/auth/user.slice";
import leaderboardReducer from "features/leaderboard/leaderboard.slice";
import matchingReducer from "features/matching/matching.slice";
import snackbarReducer from "features/snackbar/snackbar.slice";

export const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    user: userReducer,
    matching: matchingReducer,
    leaderboard: leaderboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {};
