import { HourglassFullTwoTone } from "@mui/icons-material";
import { Typography, Button, Box } from "@mui/material";

import Modal from "common/components/Modal";
import RotatingDiv from "common/components/RotatingDiv";
import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";
import getInitials from "common/utils/get-initials.util";

import {
  selectMatching,
  setHasTimeout,
  setIsMatching,
} from "features/matching/matching.slice";

import CountdownTimer from "../matching/CountdownTimer";

export default function MatchingModal() {
  const dispatch = useAppDispatch();
  const matching = useAppSelector(selectMatching);

  const { isMatching, hasTimeout, matchedPeer } = matching;

  return (
    <Modal
      isOpen={isMatching}
      handleClose={() => console.log("On press outside")}
      outlineColor={"red"}
    >
      <Box
        width={400}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {matchedPeer ? (
          <>
            <Typography fontWeight={"600"} variant="h4" sx={{ marginY: 4 }}>
              Your Peer is:
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 30,
                borderColor: "blue.main",
                borderStyle: "solid",
                height: 80,
                width: 80,
                marginBottom: 1,
              }}
            >
              <Typography fontWeight={"500"} variant="h4">
                {getInitials(matchedPeer?.displayName)}
              </Typography>
            </Box>

            <Typography
              fontWeight={"600"}
              variant="h6"
              sx={{ marginBottom: 4 }}
            >
              {matchedPeer?.displayName}
            </Typography>

            <Typography
              fontWeight={"600"}
              variant="body1"
              sx={{ marginBottom: 4 }}
            >
              The session will start soon...
            </Typography>
          </>
        ) : (
          <>
            <CountdownTimer
              timeAllowed={15}
              callbackOnTimeout={() => dispatch(setHasTimeout(true))}
              hasTimeout={hasTimeout}
            />

            <RotatingDiv disabled={hasTimeout}>
              <HourglassFullTwoTone
                sx={{
                  fontSize: 80,
                  color: `${hasTimeout ? "red" : "blue"}.main`,
                  marginY: 4,
                }}
              />
            </RotatingDiv>

            <Typography
              component="span"
              fontWeight={"600"}
              variant="h6"
              sx={{ marginBottom: 2 }}
            >
              {hasTimeout
                ? "Can't find you a match, try again later!"
                : "Sit tight! Matching you with a Peer..."}
            </Typography>

            <Button
              disableElevation
              sx={{
                color: "red.main",
                textDecoration: "underline",
                fontWeight: "500",
                textTransform: "none",
                boxShadow: 0,
              }}
              onClick={() => dispatch(setIsMatching(false))}
            >
              {hasTimeout ? "Back" : "Cancel"}
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
}
