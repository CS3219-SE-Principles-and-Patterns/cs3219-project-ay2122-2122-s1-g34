import { Person } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Link as BrowserRouter } from "react-router-dom";

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
        component={BrowserRouter}
        to={"/account"}
      >
        <Person sx={{ height: 34, width: 34, color: "black.main" }} />
      </IconButton>
    </Header>
  );
}
