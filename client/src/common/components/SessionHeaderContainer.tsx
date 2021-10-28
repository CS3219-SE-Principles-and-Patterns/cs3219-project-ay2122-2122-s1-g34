import { Button, Typography, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import Header from "common/components/Header";
import { useAppSelector } from "common/hooks/use-redux.hook";

import { selectUser } from "features/auth/user.slice";

interface SessionHeaderContainerProps {
  headerText: string;
  onLeaveSessionClick?: () => void;
  peerDisplayName: string;
}

export default function SessionHeaderContainer({
  headerText,
  onLeaveSessionClick,
  peerDisplayName,
}: SessionHeaderContainerProps) {
  const user = useAppSelector(selectUser);

  if (!user) {
    return null;
  }

  return (
    <Header>
      <Grid
        container
        item
        xs={8}
        sx={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item>
          <Typography fontWeight="600" variant="h5">
            {headerText}
          </Typography>
        </Grid>

        <Grid container item columns={2} spacing={2}>
          <Grid
            item
            sx={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              fontWeight="600"
              variant="h6"
              sx={{ color: "purple.main" }}
            >
              {user.displayName}
            </Typography>
          </Grid>

          <Grid
            item
            sx={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              fontWeight="600"
              variant="h6"
              sx={{ color: "yellow.main" }}
            >
              {peerDisplayName}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {!!onLeaveSessionClick ? (
        <Button
          variant="contained"
          size="small"
          sx={{
            borderRadius: 40,
            paddingX: 1,
            fontSize: 18,
            fontWeight: "regular",
            color: "lightGray.main",
            backgroundColor: "red.main",
            textTransform: "none",
          }}
          onClick={onLeaveSessionClick}
        >
          Leave Session
        </Button>
      ) : (
        <Button
          variant="contained"
          size="small"
          sx={{
            borderRadius: 10,
            paddingX: 2,
            fontSize: 18,
            fontWeight: "regular",
            color: "lightGray.main",
            backgroundColor: "green.main",
            textTransform: "none",
          }}
          component={RouterLink}
          to={"/past-attempts"}
        >
          Go back
        </Button>
      )}
    </Header>
  );
}
