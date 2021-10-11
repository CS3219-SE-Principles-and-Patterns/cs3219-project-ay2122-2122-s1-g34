import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

// TODO: replace dummy data
const dummyData: LeaderboardRecord[] = [
    {
        rank: 1,
        name: 'Tommy Lim',
        totalPoints: 92,
        easyQuestionsCompleted: 15, 
        mediumQuestionsCompleted: 15, 
        hardQuestionsCompleted: 15, 
    },
    {
        rank: 2,
        name: 'Hubert Klaus',
        totalPoints: 90,
        easyQuestionsCompleted: 15, 
        mediumQuestionsCompleted: 14, 
        hardQuestionsCompleted: 15, 
    },
    {
        rank: 3,
        name: 'John Tan',
        totalPoints: 89,
        easyQuestionsCompleted: 15, 
        mediumQuestionsCompleted: 14, 
        hardQuestionsCompleted: 14, 
    },
    {
        rank: 4,
        name: 'Aisyah Musah',
        totalPoints: 86,
        easyQuestionsCompleted: 14, 
        mediumQuestionsCompleted: 14, 
        hardQuestionsCompleted: 14, 
    },
    {
        rank: 5,
        name: 'Amar Patel',
        totalPoints: 85,
        easyQuestionsCompleted: 14, 
        mediumQuestionsCompleted: 14, 
        hardQuestionsCompleted: 13, 
    },
    {
        rank: 6,
        name: 'Lim Suh Hyun',
        totalPoints: 82,
        easyQuestionsCompleted: 13, 
        mediumQuestionsCompleted: 14, 
        hardQuestionsCompleted: 13, 
    }
];


export interface LeaderboardRecord {
    rank: number;
    name: string;
    totalPoints: number;
    easyQuestionsCompleted: number;
    mediumQuestionsCompleted: number;
    hardQuestionsCompleted: number;
}

export interface Leaderboard {
    leaderboardRecords: LeaderboardRecord[];
}

const initialState: Leaderboard = {
    // leaderboardRecords: [],
    leaderboardRecords: dummyData
};

export const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    setLeaderboardRecords: (state, action: PayloadAction<LeaderboardRecord[]>) => {
        state.leaderboardRecords = action.payload;
    },
  },
});

export const { setLeaderboardRecords } = leaderboardSlice.actions;

export const selectLeaderboard = (state: RootState) => state.leaderboard;

export default leaderboardSlice.reducer;
