import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "app/store";

import { UserData } from "features/auth/map-user-data.util";
import { Question } from "features/practice-session/question.interface";

export interface PracticeSession {
  roomId?: string;
  question?: Question;
  peerOne?: UserData;
  peerTwo?: UserData;
  hasEnded: boolean;
  hasSubmitted: boolean;
  hasClickedOnLeaveSession: boolean;
  hasClickedOnSubmitSession: boolean;
  isPeerOffline: boolean;
  isUserOffline: boolean;
}

const initialState: PracticeSession = {
  hasEnded: false,
  hasSubmitted: false,
  hasClickedOnLeaveSession: false,
  hasClickedOnSubmitSession: false,
  isPeerOffline: false,
  isUserOffline: false,
};

export const practiceSessionSlice = createSlice({
  name: "practiceSession",
  initialState,
  reducers: {
    setPeers: (states, action: PayloadAction<UserData[]>) => {
      states.peerOne = action.payload[0];
      states.peerTwo = action.payload[1];
    },
    setRoomId: (states, action: PayloadAction<string>) => {
      states.roomId = action.payload;
    },
    setQuestion: (states, action: PayloadAction<Question>) => {
      states.question = action.payload;
    },
    setHasEnded: (states, action: PayloadAction<boolean>) => {
      states.hasEnded = action.payload;
    },
    setHasSubmitted: (states, action: PayloadAction<boolean>) => {
      states.hasSubmitted = action.payload;
    },
    setHasClickedOnLeaveSession: (states, action: PayloadAction<boolean>) => {
      states.hasClickedOnLeaveSession = action.payload;
    },
    setHasClickedOnSubmitSession: (states, action: PayloadAction<boolean>) => {
      states.hasClickedOnSubmitSession = action.payload;
    },
    setIsPeerOffline: (states, action: PayloadAction<boolean>) => {
      states.isPeerOffline = action.payload;
    },
    setIsUserOffline: (states, action: PayloadAction<boolean>) => {
      states.isUserOffline = action.payload;
    },
    resetSession: (_) => {
      return initialState;
    },
  },
});

export const {
  setPeers,
  setRoomId,
  setQuestion,
  setHasEnded,
  setHasSubmitted,
  setHasClickedOnLeaveSession,
  setHasClickedOnSubmitSession,
  resetSession,
  setIsPeerOffline,
  setIsUserOffline,
} = practiceSessionSlice.actions;

export const selectPracticeSession = (state: RootState) =>
  state.practiceSession;

export default practiceSessionSlice.reducer;
