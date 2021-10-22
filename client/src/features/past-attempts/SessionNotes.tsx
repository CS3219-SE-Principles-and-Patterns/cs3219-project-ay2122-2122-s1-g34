import {
  Box,
  BoxProps,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

import { Question } from "features/practice-session/question.interface";

interface SessionNotesProps extends BoxProps {
  question: Question;
}

export default function SessionNotes({
  question,
  sx,
  ...rest
}: SessionNotesProps) {
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
      <Stack sx={{ height: "100%" }}>
        <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: "bold" }}>
          Notes
        </Typography>
        <Box
          component="textarea"
          autoFocus
          sx={{
            resize: "none",
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "1rem",
          }}
        />
      </Stack>
    </Box>
  );
}
