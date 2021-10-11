import { Attempt } from "./past-attempts.slice";

export default function getTotalPoints(data: Attempt[]): number {
    return data.reduce((prev, curr) => {
      return prev + curr.points;
    }, 0);
}