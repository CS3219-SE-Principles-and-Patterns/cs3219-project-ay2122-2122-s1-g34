import { keyframes } from "@emotion/react";
import { Box, styled } from "@mui/material";
import { ReactNode } from "react";

const rotate = keyframes`
0 {
  transform: rotate(0deg);
}

50% {
  transform: rotate(180deg);
}

100% {
  transform: rotate(360deg);
}
`;

const StyledDiv = styled("div")(({ theme }) => ({
  animation: `${rotate} 2s infinite ease`,
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
}));

export default function RotatingDiv({
  children,
  disabled = false,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <>{disabled ? <Box>{children}</Box> : <StyledDiv>{children}</StyledDiv>}</>
  );
}
