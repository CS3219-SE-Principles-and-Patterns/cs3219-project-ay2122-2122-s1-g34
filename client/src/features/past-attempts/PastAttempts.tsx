import { Box, Container, Grid, Typography } from "@mui/material";
import { Redirect } from "react-router-dom";

import { useAppSelector } from "common/hooks/use-redux.hook";

import SignedInHeader from "features/auth/SignedInHeader";
import { selectUser } from "features/auth/user.slice";

import AttemptRow from "./AttemptRow";
import { selectPastAttempts } from "./past-attempts.slice";

export default function PastAttempts() {
  const user = useAppSelector(selectUser);
  const pastAttempts = useAppSelector(selectPastAttempts);

  return !!user ? (
    <Redirect
      to={{
        pathname: "/",
      }}
    />
  ) : (
    <>
      <SignedInHeader />

      <Container maxWidth="lg" disableGutters sx={{ paddingY: 1 }}>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            alignSelf: "flex-start",
            justifyContent: "space-between",
            textAlign: "left",
          }}
        >
          <Typography variant="h5" fontWeight={"600"} gutterBottom>
            Review Past Attempts
          </Typography>

          <Typography variant="h6" fontWeight={"600"} gutterBottom>
            Total points: {pastAttempts.totalPoints}
          </Typography>
        </Box>

        <Box sx={{ mt: 1, flexGrow: 1, textAlign: "center" }}>
          <Grid
            container
            spacing={4}
            columns={13}
            sx={{
              "&.MuiGrid-root": {
                marginLeft: 0,
                width: "100%",
              },
            }}
          >
            <AttemptRow />
            {pastAttempts.pastAttempts ? (
              pastAttempts.pastAttempts.map((attempt, i) => {
                return <AttemptRow key={"attempt" + i} attempt={attempt} />;
              })
            ) : (
              <Typography variant="h6" fontWeight={"600"}>
                No attempt yet!
              </Typography>
            )}
          </Grid>
        </Box>
      </Container>
    </>
  );
}
