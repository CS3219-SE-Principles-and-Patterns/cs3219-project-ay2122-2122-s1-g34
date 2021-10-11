import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { UserData } from "features/auth/map-user-data.util";

// TODO: replace dummy data
// const dummyUserData: UserData = {
//     id: '1A2B3C4D',
//     displayName: 'John Tan',
//     email: 'johntan@gmail.com',
//     token: '1234567ABCDEFG',
// }

export type DifficultyLevel = "easy" | 'medium' | 'hard';

export interface Matching {
  isMatching: boolean;
  hasTimeout: boolean;
  difficulty?: DifficultyLevel;
  matchedPeer?: UserData;
}

const initialState: Matching = {
    isMatching: false,
    hasTimeout: false,
    // matchedPeer: dummyUserData
};

export const matchingSlice = createSlice({
  name: "matching",
  initialState,
  reducers: {
      setIsMatching: (state, action: PayloadAction<boolean>) => {
          state.isMatching = action.payload;
      },
      setHasTimeout: (state, action: PayloadAction<boolean>) => {
        state.hasTimeout = action.payload;
      },
      setDifficulty: (state, action: PayloadAction<DifficultyLevel>) => {
        state.difficulty = action.payload;
      },
      setMatchedPeer: (state, action: PayloadAction<UserData>) => {
        state.matchedPeer = action.payload;
      },
  },
});

export const { setIsMatching, setHasTimeout, setDifficulty, setMatchedPeer } =
  matchingSlice.actions;

export const selectMatching = (state: RootState) => state.matching;

export default matchingSlice.reducer;
