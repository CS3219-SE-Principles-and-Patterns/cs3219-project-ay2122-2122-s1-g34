import { Container, Typography, Button, Box } from "@mui/material";

export default function LostConnectionPage() {
  return (
    <Container
      fixed
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          You lost your network connection. Refresh the page when you are
          connected to a working network.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            window.location.reload();
            return false;
          }}
        >
          Refresh
        </Button>
      </Box>
    </Container>
  );
}
