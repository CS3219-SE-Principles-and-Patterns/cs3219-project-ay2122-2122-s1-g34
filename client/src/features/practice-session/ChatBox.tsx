import { Box, BoxProps } from "@mui/material";

interface ChatBoxProps extends BoxProps {}

export default function ChatBox({ sx, ...rest }: ChatBoxProps) {
  return (
    <Box
      {...rest}
      sx={{
        ...(sx ?? {}),
        borderRadius: 3,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#67A0AC",
        padding: 2,
      }}
    ></Box>
  );
}
