import { Button, Grid, Typography } from "@mui/material";

import { useAppDispatch } from "common/hooks/use-redux.hook";

import { Attempt, setCurrentAttempt } from "./past-attempts.slice";

interface AttemptRowProps {
  attempt?: Attempt;
}

export default function AttemptRow({ attempt }: AttemptRowProps) {
  const dispatch = useAppDispatch();

  if (!attempt) {
    return (
      <Grid
        container
        item
        spacing={2}
        sx={{
          marginBottom: 1,
          "&.MuiGrid-item": {
            paddingLeft: 0,
          },
          "&.MuiGrid-root.MuiGrid-root": {
            marginLeft: 0,
          },
        }}
      >
        <Grid
          item
          xs={3}
          sx={{
            "&.MuiGrid-item.MuiGrid-item": {
              paddingLeft: 0,
            },
          }}
        >
          <Typography fontWeight="500">Question</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            "&.MuiGrid-item.MuiGrid-item": {
              paddingLeft: 0,
            },
          }}
        >
          <Typography fontWeight="500">Difficulty</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            "&.MuiGrid-item.MuiGrid-item": {
              paddingLeft: 0,
            },
          }}
        >
          <Typography fontWeight="500">Status</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            "&.MuiGrid-item.MuiGrid-item": {
              paddingLeft: 0,
            },
          }}
        >
          <Typography fontWeight="500">Peer</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            "&.MuiGrid-item.MuiGrid-item": {
              paddingLeft: 0,
            },
          }}
        >
          <Typography fontWeight="500">Points</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            "&.MuiGrid-item.MuiGrid-item": {
              paddingLeft: 0,
            },
          }}
        >
          <Typography fontWeight="500">Review</Typography>
        </Grid>
      </Grid>
    );
  } else {
    const { question, difficulty, status, peer, points } = attempt;

    const difficultyColor =
      difficulty === "easy"
        ? "green"
        : difficulty === "medium"
        ? "yellow"
        : "red";

    return (
      <Grid
        container
        item
        spacing={2}
        sx={{
          borderStyle: "solid",
          borderWidth: 2,
          borderColor: `${difficultyColor}.main`,
          marginY: 1,
          borderRadius: 4,
          boxShadow: 3,
          "&.MuiGrid-item": {
            paddingY: 0,
            height: 74,
            paddingLeft: 0,
          },
          "&.MuiGrid-root": {
            marginLeft: 0,
          },
        }}
      >
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&.MuiGrid-item.MuiGrid-item": {
              paddingTop: 0,
              paddingLeft: 0,
            },
          }}
        >
          <Typography>{question}</Typography>
        </Grid>

        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&.MuiGrid-item.MuiGrid-item": {
              paddingTop: 0,
              paddingLeft: 0,
            },
            "p:first-letter": {
              textTransform: "capitalize",
            },
          }}
        >
          <Typography>{difficulty}</Typography>
        </Grid>

        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&.MuiGrid-item.MuiGrid-item": {
              paddingTop: 0,
              paddingLeft: 0,
            },
            "p:first-letter": {
              textTransform: "capitalize",
            },
          }}
        >
          <Typography>{status}</Typography>
        </Grid>

        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&.MuiGrid-item.MuiGrid-item": {
              paddingTop: 0,
              paddingLeft: 0,
            },
          }}
        >
          <Typography>{peer}</Typography>
        </Grid>

        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&.MuiGrid-item.MuiGrid-item": {
              paddingTop: 0,
              paddingLeft: 0,
            },
          }}
        >
          <Typography>{points}</Typography>
        </Grid>

        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&.MuiGrid-item.MuiGrid-item": {
              paddingTop: 0,
              paddingLeft: 0,
            },
          }}
        >
          <Button
            variant="contained"
            onClick={onClickReview}
            sx={{
              textTransform: "none",
              borderRadius: 10,
              backgroundColor: "orange.main",
            }}
          >
            Review
          </Button>
        </Grid>
      </Grid>
    );
  }

  function onClickReview() {
    console.log("On click review");
    // TODO: navigate to review page

    if (attempt) {
      dispatch(setCurrentAttempt(attempt));
    }
  }
}
