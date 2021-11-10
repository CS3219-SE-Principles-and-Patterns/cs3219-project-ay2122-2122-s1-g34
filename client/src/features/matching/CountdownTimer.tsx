import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import {
  CLEAR_INTERVAL,
  INTERVAL_TIMEOUT,
  SET_INTERVAL,
  timerWorkerScript,
} from "common/utils/timer-worker-script.util";

export default function CountdownTimer({
  timeAllowed,
  callbackOnTimeout,
  hasTimeout,
}: {
  timeAllowed: number;
  callbackOnTimeout: () => void;
  hasTimeout: boolean;
}) {
  const [remainingTime, setRemainingTime] = useState(timeAllowed);
  const timerWorker = useRef<Worker>(new Worker(timerWorkerScript));

  useEffect(() => {
    timerWorker.current.postMessage({
      id: CLEAR_INTERVAL,
    });

    let remainingTimeVar = timeAllowed;
    timerWorker.current.onmessage = (response) => {
      if (response.data.id === INTERVAL_TIMEOUT) {
        if (remainingTimeVar <= 0) {
          timerWorker.current.postMessage({
            id: CLEAR_INTERVAL,
          });
          callbackOnTimeout();
        }
        setRemainingTime((remainingTime) => remainingTime - 1);
        remainingTimeVar--;
      }
    };
    timerWorker.current.postMessage({
      id: SET_INTERVAL,
      timeMs: 1000,
    });

    const timerWorkerReference = timerWorker.current;
    return () => {
      timerWorkerReference.postMessage({
        id: CLEAR_INTERVAL,
      });
    };

    // we do not want the useEffect to re-run after initial mount as this can lead to weird behaviors
    // eslint-disable-next-line
  }, []);

  return (
    <Typography fontWeight={"600"} variant="h4" sx={{ marginTop: 6 }}>
      {hasTimeout ? "Timeout" : `00:${getPaddedTime(remainingTime)}`}
    </Typography>
  );

  function getPaddedTime(time: number): string {
    return time >= 10 ? time + "" : "0" + time;
  }
}
