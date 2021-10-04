import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signOut } from "firebase/auth";

import { RootState } from "app/store";

import { auth } from "common/utils/firebase.util";

import { UserData, mapUserData } from "features/auth/map-user-data.util";
import {
  removeUserStorage,
  setUserStorage,
} from "features/auth/user-storage.util";

const initialState: UserData | false = false;

export const logout = createAsyncThunk("user/logout", async () => {
  removeUserStorage();
  await signOut(auth);
});

export const reload = createAsyncThunk<UserData | false>(
  "user/reload",
  async () => {
    if (!auth.currentUser) {
      return Promise.resolve(false);
    }

    await auth.currentUser.reload();
    const userData = await mapUserData(auth.currentUser);

    if (userData) {
      setUserStorage(userData);
    }

    return userData;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: initialState as UserData | false,
  reducers: {
    setUserData: (_, action: PayloadAction<UserData | false>) => {
      if (action.payload) {
        setUserStorage(action.payload);
      }
      
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, () => {
        return false;
      })
      .addCase(reload.fulfilled, (_, action) => {
        return action.payload;
      });
  },
});

export const { setUserData } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
