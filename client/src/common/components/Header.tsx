import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

import TopRainbowBar from "./TopRainbowBar";

interface HeaderProps {
  children: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <>
      <TopRainbowBar />
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
          sx={{
            fontWeight: "bold",
            color: "black.main",
            cursor: "pointer",
            textDecoration: "none",
          }}
          component={RouterLink}
          to="/"
        >
          PeerPrep
        </Typography>
        {children}
      </Box>
    </>
  );
}
