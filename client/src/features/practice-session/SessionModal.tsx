import { Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import Modal from "common/components/Modal";
import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";

import {
  selectPracticeSession,
  resetSession,
  setHasClickedOnLeaveSession,
  setHasClickedOnSubmitSession,
  setHasEnded,
  setHasSubmitted,
} from "./practice-session.slice";

export default function SessionModal() {
  const dispatch = useAppDispatch();
  const practiceSession = useAppSelector(selectPracticeSession);

  const {
    question,
    peerOne,
    peerTwo,
    hasEnded,
    hasSubmitted,
    hasClickedOnLeaveSession,
    hasClickedOnSubmitSession,
  } = practiceSession;

  return (
    <Modal
      isOpen={
        hasEnded ||
        hasSubmitted ||
        hasClickedOnLeaveSession ||
        hasClickedOnSubmitSession
      }
      handleClose={() => console.log("On press outside")}
      outlineColor={"green"}
    >
      <Box
        width={600}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingY: 4,
          paddingX: 8,
        }}
      >
        {hasEnded || hasSubmitted ? (
          <>
            <Typography fontWeight={"600"} variant="h4" sx={{ marginY: 2 }}>
              {hasSubmitted ? "Successfully Submitted" : "Session Ended"}
            </Typography>

            <Typography
              fontWeight="600"
              variant="h6"
              sx={{ textAlign: "center", marginBottom: 4 }}
            >
              <Typography
                fontWeight="600"
                variant="h6"
                component="span"
                sx={{ color: "purple.main" }}
              >
                {peerOne?.displayName}
              </Typography>
              {" & "}
              <Typography
                component="span"
                fontWeight="600"
                variant="h6"
                sx={{ color: "yellow.main" }}
              >
                {peerTwo?.displayName}
              </Typography>
              <Typography fontWeight="600" variant="h6">
                {hasSubmitted ? "has completed" : "did not complete"}
                <br />
                {question?.title}
              </Typography>
            </Typography>

            {hasSubmitted && (
              <>
                <Button
                  variant="text"
                  sx={{
                    textDecoration: "underline",
                    textTransform: "none",
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                  component={RouterLink}
                  to="/past-attempts"
                  onClick={onClickResetSession}
                >
                  Click to view attempt
                </Button>
                <Typography fontWeight={"600"} variant="h6">
                  OR
                </Typography>
              </>
            )}
            <Button
              variant="text"
              sx={{
                textDecoration: "underline",
                textTransform: "none",
                fontSize: 20,
                fontWeight: 600,
                color: "blue.main",
              }}
              component={RouterLink}
              to="/"
              onClick={onClickResetSession}
            >
              Go back to dashboard
            </Button>
          </>
        ) : hasClickedOnLeaveSession || hasClickedOnSubmitSession ? (
          <>
            <Typography
              fontWeight={"600"}
              variant="h4"
              sx={{ marginY: 2, color: "orange.main" }}
            >
              Are you sure?
            </Typography>

            <Typography
              fontWeight="600"
              variant="h6"
              sx={{ textAlign: "center", marginBottom: 4 }}
            >
              {hasClickedOnLeaveSession
                ? "Leaving will not close this session. You can rejoin this session as long as your peer has not left the session."
                : "Ready to submit your solution? You can't undo this action!"}
            </Typography>

            <Box
              width={300}
              sx={{
                display: "flex",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="text"
                sx={{
                  textDecoration: "underline",
                  textTransform: "none",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "blue.main",
                }}
                onClick={onClickCancel}
              >
                Cancel
              </Button>

              {hasClickedOnLeaveSession ? (
                <Button
                  variant="text"
                  sx={{
                    textDecoration: "underline",
                    textTransform: "none",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "red.main",
                  }}
                  onClick={onClickLeaveSessionLeave}
                >
                  Leave
                </Button>
              ) : (
                <Button
                  variant="text"
                  sx={{
                    textDecoration: "underline",
                    textTransform: "none",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "green.main",
                  }}
                  onClick={onClickSubmitSessionSubmit}
                >
                  Submit
                </Button>
              )}
            </Box>
          </>
        ) : (
          <></>
        )}
      </Box>
    </Modal>
  );

  function onClickResetSession(): void {
    dispatch(resetSession());
  }

  function onClickCancel() {
    dispatch(setHasClickedOnLeaveSession(false));
    dispatch(setHasClickedOnSubmitSession(false));
  }

  function onClickLeaveSessionLeave() {
    dispatch(setHasEnded(true));
  }

  function onClickSubmitSessionSubmit() {
    dispatch(setHasSubmitted(true));

    // TODO: Submit the session
  }
}
