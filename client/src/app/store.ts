import { configureStore } from "@reduxjs/toolkit";

import userReducer from "features/auth/user.slice";
import snackbarReducer from "features/snackbar/snackbar.slice";

export const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
