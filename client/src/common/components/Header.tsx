import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useHistory } from "react-router-dom";

interface HeaderProps {
  children: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const history = useHistory();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginX: 8,
        marginY: 3,
      }}
    >
      <Typography
        variant="h3"
        sx={{ fontWeight: "bold", color: "black.main", cursor: "pointer" }}
        onClick={onLogoClick}
      >
        PeerPrep
      </Typography>
      {children}
    </Box>
  );

  function onLogoClick() {
    history.push("/");
  }
}
