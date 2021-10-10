import { Box, Container, Grid, Typography } from "@mui/material";
import { Redirect } from "react-router-dom";

import { useAppSelector } from "common/hooks/use-redux.hook";

import SignedInHeader from "features/auth/SignedInHeader";
import { selectUser } from "features/auth/user.slice";

import LeaderboardSection from "./LeaderboardSection";
import LeaderboardUserSection from "./LeaderboardUserSection";

export default function Dashboard() {
  const user = useAppSelector(selectUser);

  return !!user ? (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <SignedInHeader />
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          paddingY: 1,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Typography variant="h5" fontWeight={"600"} gutterBottom>
          Leaderboard
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            flexDirection: "column",
            flexGrow: 1,
            mt: 3,
          }}
        >
          <Grid container spacing={4} sx={{ display: "flex", flexGrow: 1 }}>
            <LeaderboardUserSection />
            <LeaderboardSection />
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
