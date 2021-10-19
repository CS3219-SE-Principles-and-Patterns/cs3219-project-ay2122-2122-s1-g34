import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { UserData } from "features/auth/map-user-data.util";
import { Question } from "features/practice-session/question.interface";

// TODO: Replace dummy data
const dummyData: UserData[] = [
    {
        id: "1234",
        displayName: "Nancy Lim",
        email: "nancy@gmail.com",
        token: 'wwwwwww',
    },
    {
        id: "12343333",
        displayName: "John Tan",
        email: "john@gmail.com",
        token: 'wwwwwww1111',
    },
  ];

  const dummyQuestion: Question = {
    title: "Hello",
    questionHtml: "helllllo",
  }

export interface PracticeSession {
    question?: Question;
    peerOne?: UserData;
    peerTwo?: UserData;
    hasEnded: boolean;
    hasSubmitted: boolean;
    hasClickedOnLeaveSession: boolean;
    hasClickedOnSubmitSession: boolean;
    isPeerOffline: boolean;
}

const initialState: PracticeSession = {
    // question: dummyQuestion,
    // peerOne: dummyData[0],
    // peerTwo: dummyData[1],
    hasEnded: false,
    hasSubmitted: false,
    hasClickedOnLeaveSession: false,
    hasClickedOnSubmitSession: false,
    isPeerOffline: false,
};


export const practiceSessionSlice = createSlice({
    name: "practiceSession",
    initialState,
    reducers: {
        setPeers: (states, action: PayloadAction<UserData[]>) => {
            states.peerOne = action.payload[0];
            states.peerTwo = action.payload[1];
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
        resetSession: (states) => {
            states = initialState;
        }
    },
  });
  
  export const { setPeers, setQuestion, setHasEnded, setHasSubmitted, setHasClickedOnLeaveSession, setHasClickedOnSubmitSession, resetSession, setIsPeerOffline } = practiceSessionSlice.actions;
  
  export const selectPracticeSession = (state: RootState) => state.practiceSession;
  
  export default practiceSessionSlice.reducer;
  