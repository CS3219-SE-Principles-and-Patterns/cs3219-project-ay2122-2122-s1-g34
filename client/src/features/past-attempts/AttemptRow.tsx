import { Button, Grid, Typography, styled } from "@mui/material";
import { Link, useRouteMatch } from "react-router-dom";

import { PastAttempt } from "features/past-attempts/past-attempt.interface";

const HeaderGrid = styled(Grid)({
  marginBottom: 1,
  "&.MuiGrid-item": {
    paddingLeft: 0,
  },
  "&.MuiGrid-root.MuiGrid-root": {
    marginLeft: 0,
  },
});

const AttemptGrid = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&.MuiGrid-item.MuiGrid-item": {
    paddingTop: 0,
    paddingLeft: 0,
  },
});

interface AttemptRowProps {
  attempt?: PastAttempt;
}

export default function AttemptRow({ attempt }: AttemptRowProps) {
  const { url } = useRouteMatch();

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
        <HeaderGrid item xs={4}>
          <Typography fontWeight="500">Question</Typography>
        </HeaderGrid>
        <HeaderGrid item xs={2}>
          <Typography fontWeight="500">Difficulty</Typography>
        </HeaderGrid>
        <HeaderGrid item xs={4}>
          <Typography fontWeight="500">Peer</Typography>
        </HeaderGrid>
        {/* TODO: Add points system if have time */}
        {/* <HeaderGrid item xs={2}>
          <Typography fontWeight="500">Points</Typography>
        </HeaderGrid> */}
        <HeaderGrid item xs={2}>
          <Typography fontWeight="500">Review</Typography>
        </HeaderGrid>
      </Grid>
    );
  } else {
    const { question, difficulty, id, peerDisplayName } = attempt;

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
        <AttemptGrid item xs={4}>
          <Typography>{question.title}</Typography>
        </AttemptGrid>
        <AttemptGrid item xs={2}>
          <Typography
            sx={{
              textTransform: "capitalize",
            }}
          >
            {difficulty}
          </Typography>
        </AttemptGrid>
        <AttemptGrid item xs={4}>
          <Typography>{peerDisplayName}</Typography>
        </AttemptGrid>
        {/* TODO: Add points system if have time */}
        {/* <AttemptGrid item xs={2}>
          <Typography>{points}</Typography>
        </AttemptGrid> */}
        <AttemptGrid item xs={2}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 10,
              backgroundColor: "orange.main",
            }}
            component={Link}
            to={`${url}/${id}`}
          >
            Review
          </Button>
        </AttemptGrid>
      </Grid>
    );
  }
}
