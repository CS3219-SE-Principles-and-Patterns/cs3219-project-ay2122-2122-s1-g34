import { DifficultyLevel } from "features/matching/matching.slice";
import { Attempt } from "./past-attempts.slice";

export default function getNumberOfQuestionsDone(data: Attempt[], difficultyLevel: DifficultyLevel): number {
    return data.filter((attempt) => {
        return attempt.difficulty === difficultyLevel && attempt.status === 'completed'
    }).length;
}