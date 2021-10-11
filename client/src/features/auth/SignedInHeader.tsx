import { Person } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import Header from "common/components/Header";

export default function SignedInHeader() {
  return (
    <Header>
      <IconButton
        sx={{
          borderWidth: 4,
          borderColor: "red.main",
          borderStyle: "solid",
          height: 50,
          width: 50,
        }}
        onClick={navigateToAccountPage}
      >
        <Person sx={{ height: 34, width: 34, color: "black.main" }} />
      </IconButton>
    </Header>
  );

  function navigateToAccountPage() {
    console.log("Navigate to account page");
    // TODO: Navigate to account page
  }
}
