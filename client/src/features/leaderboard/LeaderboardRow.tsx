import { Grid, Typography } from "@mui/material";

import { LeaderboardRecord } from "./leaderboard.slice";

interface LeaderboardRowProps {
  leaderboardRecord?: LeaderboardRecord;
}

export default function LeaderboardRow({
  leaderboardRecord,
}: LeaderboardRowProps) {
  // Grid header
  if (!leaderboardRecord) {
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
          xs={1}
          sx={{
            "&.MuiGrid-item.MuiGrid-item": {
              paddingLeft: 0,
            },
          }}
        >
          <Typography fontWeight="600" variant="h5">
            Rank
          </Typography>
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
          <Typography fontWeight="600" variant="h5">
            Name
          </Typography>
        </Grid>

        <Grid
          item
          xs={1}
          sx={{
            "&.MuiGrid-item.MuiGrid-item": {
              paddingLeft: 0,
            },
          }}
        >
          <Typography fontWeight="600" variant="h5">
            Points
          </Typography>
        </Grid>

        <Grid
          item
          xs={3}
          sx={{
            "&.MuiGrid-item.MuiGrid-item.MuiGrid-item": {
              paddingLeft: 0,
              paddingTop: 0,
            },
          }}
        >
          <Grid item>
            <Typography fontWeight="600">Questions done</Typography>
          </Grid>

          <Grid container item columns={3}>
            <Grid
              item
              sx={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography fontWeight="500">Easy</Typography>
            </Grid>

            <Grid
              item
              sx={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography fontWeight="500">Medium</Typography>
            </Grid>

            <Grid
              item
              sx={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography fontWeight="500">Hard</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
    const {
      rank,
      name,
      totalPoints,
      easyQuestionsCompleted,
      mediumQuestionsCompleted,
      hardQuestionsCompleted,
    } = leaderboardRecord;
    return (
      <Grid
        container
        item
        spacing={2}
        sx={{
          borderStyle: "solid",
          borderWidth: 3,
          borderColor: "lightGray.main",
          marginY: 1,
          borderRadius: 4,
          "&.MuiGrid-item": {
            paddingY: 0,
            height: 70,
            paddingLeft: 0,
          },
          "&.MuiGrid-root": {
            marginLeft: 0,
          },
        }}
      >
        <Grid
          item
          xs={1}
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
          <Typography fontWeight="500" variant="h4">
            {rank}
          </Typography>
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
          <Typography fontWeight="600" variant="h6">
            {name}
          </Typography>
        </Grid>

        <Grid
          item
          xs={1}
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
          <Typography fontWeight="500" variant="h6">
            {totalPoints}
          </Typography>
        </Grid>

        <Grid
          item
          xs={1}
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
          <Typography fontWeight="500" variant="h6">
            {easyQuestionsCompleted}
          </Typography>
        </Grid>

        <Grid
          item
          xs={1}
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
          <Typography fontWeight="500" variant="h6">
            {mediumQuestionsCompleted}
          </Typography>
        </Grid>

        <Grid
          item
          xs={1}
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
          <Typography fontWeight="500" variant="h6">
            {hardQuestionsCompleted}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}
