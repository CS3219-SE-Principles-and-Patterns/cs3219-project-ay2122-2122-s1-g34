import {
  Box,
  Container,
  Grid,
  Typography,
  LinearProgress,
} from "@mui/material";
import useSWR from "swr";

import { useAppSelector } from "common/hooks/use-redux.hook";

import SignedInHeader from "features/auth/SignedInHeader";
import { selectUser } from "features/auth/user.slice";
import AttemptRow from "features/past-attempts/AttemptRow";
import { PastAttempt } from "features/past-attempts/past-attempt.interface";

export default function PastAttempts() {
  const user = useAppSelector(selectUser);
  const { data } = useSWR<PastAttempt[]>(
    user ? ["/practice", user.token] : null
  );

  return (
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

          {/* TODO: Add points system if have time */}
          {/* <Typography variant="h6" fontWeight={"600"} gutterBottom>
            Total points: {pastAttempts.totalPoints}
          </Typography> */}
        </Box>

        {!data ? (
          <LinearProgress />
        ) : (
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
              {data.length === 0 ? (
                <Typography variant="h6" fontWeight={"600"}>
                  No Attempts yet!
                </Typography>
              ) : (
                data.map((attempt) => (
                  <AttemptRow key={attempt.id} attempt={attempt} />
                ))
              )}
            </Grid>
          </Box>
        )}
      </Container>
    </>
  );
}
