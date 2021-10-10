import { Box, Grid, useTheme } from "@mui/material";

import { useAppSelector } from "common/hooks/use-redux.hook";

import LeaderboardRow from "./LeaderboardRow";
import { selectLeaderboard } from "./leaderboard.slice";

export default function LeaderboardSection() {
  const themePalette = useTheme().palette;

  const leaderboard = useAppSelector(selectLeaderboard);

  return (
    <Grid
      item
      xs={8}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexGrow: 1,
        paddingBottom: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          borderWidth: 3,
          borderStyle: "solid",
          width: "100%",
          height: "70vh",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: `-4px 4px 3px ${themePalette["red"].main}`,
          padding: 6,
          paddingBottom: 4,
          overflow: "auto",
          //   "&::-webkit-scrollbar": {
          //     display: "none",
          //   },
        }}
        borderColor={"red.main"}
      >
        <Grid container spacing={2} columns={7}>
          <LeaderboardRow />
          {leaderboard.leaderboardRecords.map((record) => {
            return <LeaderboardRow leaderboardRecord={record} />;
          })}
        </Grid>
      </Box>
    </Grid>
  );
}
