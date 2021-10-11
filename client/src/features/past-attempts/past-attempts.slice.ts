import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { DifficultyLevel } from "features/matching/matching.slice";
import getNumberOfQuestionsDone from "./get-number-of-questions-done.util";
import getTotalPoints from "./get-total-points.util";

// TODO: replace dummy data
const dummyData: Attempt[] = [
  {
    question: "Triangular, pentagonal, and hexagonal",
    difficulty: "medium",
    status: "completed",
    peer: "Alexander Luke",
    points: 2,
  },
  {
    question: "Consecutive prime sum",
    difficulty: "easy",
    status: "completed",
    peer: "John Tan",
    points: 1,
  },

  {
    question: "Eulerian Cycles",
    difficulty: "hard",
    status: "completed",
    peer: "Kum Su Hyun",
    points: 3,
  },
];

export interface Attempt {
  question: string;
  difficulty: DifficultyLevel;
  status: string;
  peer: string;
  points: number;
}

export interface PastAttempts {
    pastAttempts?: Attempt[];
    currentAttempt?: Attempt;
    totalPoints: number;
    easyQuestionsDone: number;
    mediumQuestionsDone: number;
    hardQuestionsDone: number;
}

const initialState: PastAttempts = {
    pastAttempts: dummyData,
    totalPoints: getTotalPoints(dummyData),
    easyQuestionsDone: getNumberOfQuestionsDone(dummyData, 'easy'),
    mediumQuestionsDone: getNumberOfQuestionsDone(dummyData, 'medium'),
    hardQuestionsDone: getNumberOfQuestionsDone(dummyData, 'hard'),
    // totalPoints: 0
    // easyQuestionsDone: 0,
    // mediumQuestionsDone: 0,
    // hardQuestionsDone: 0,
};

export const pastAttemptsSlice = createSlice({
  name: "pastAttempts",
  initialState,
  reducers: {
    setPastAttempts: (state, action: PayloadAction<Attempt[]>) => {
      const pastAttempts = action.payload;
      state.pastAttempts = pastAttempts;

      const totalPoints = getTotalPoints(pastAttempts);
      state.totalPoints = totalPoints;

      state.easyQuestionsDone = getNumberOfQuestionsDone(pastAttempts, 'easy');
      state.mediumQuestionsDone = getNumberOfQuestionsDone(pastAttempts, 'medium');
      state.hardQuestionsDone = getNumberOfQuestionsDone(pastAttempts, 'hard');
    },
    setCurrentAttempt: (state, action: PayloadAction<Attempt>) => {
      state.currentAttempt = action.payload;
    },

  },
});

export const { setPastAttempts, setCurrentAttempt } = pastAttemptsSlice.actions;

export const selectPastAttempts = (state: RootState) => state.pastAttempts;

export default pastAttemptsSlice.reducer;
