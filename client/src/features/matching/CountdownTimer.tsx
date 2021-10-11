import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function CountdownTimer({
  timeAllowed,
  callbackOnTimeout,
  hasTimeout
}: {
  timeAllowed: number;
  callbackOnTimeout: () => void;
  hasTimeout: boolean;
}) {
  const [remainingTime, setRemainingTime] = useState(timeAllowed);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearInterval(timeout.current);
    timeout.current = window.setInterval(() => {
      if (!remainingTime) {
        window.clearInterval(timeout.current);
        callbackOnTimeout();
        return false;
      }
      setRemainingTime(remainingTime - 1);
    }, 1000);
  }, [callbackOnTimeout, remainingTime]);

  return (
    <Typography fontWeight={"600"} variant="h4" sx={{ marginTop: 6 }}>
      {hasTimeout ? "Timeout" : `00:${getPaddedTime(remainingTime)}`}
    </Typography>
  );

  function getPaddedTime(time: number): string {
    return time >= 10 ? time + "" : "0" + time;
  }
}
