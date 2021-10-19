import { Box, BoxProps, Typography } from "@mui/material";

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
        borderColor: "blue.main",
        padding: 2,
      }}
    >
      <Typography variant="h6" fontWeight="600">
        Chat
      </Typography>
    </Box>
  );
}
