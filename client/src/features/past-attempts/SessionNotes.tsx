import {
  Box,
  BoxProps,
  CircularProgress,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import axios from "axios";
import { debounce } from "lodash";
import React from "react";
import { useParams } from "react-router-dom";

import { useAppSelector } from "common/hooks/use-redux.hook";

import { selectUser } from "features/auth/user.slice";
import { Notes } from "features/past-attempts/notes.type";

// debounced function to save note only 500ms after no updates
const updateNote = debounce(
  async (
    note: string,
    sessionId: string,
    token: string,
    onSave: () => void
  ) => {
    await axios.put(`/practice/${sessionId}`, { note }, { headers: { token } });
    onSave();
  },
  500
);

const StyledTextArea = styled("textarea")({
  resize: "none",
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: "1rem",
});

interface SessionNotesProps extends BoxProps {
  notes: Notes;
}

export default function SessionNotes({
  notes,
  sx,
  ...rest
}: SessionNotesProps) {
  const noteContent = notes?.[0]?.note ?? "";
  const [note, setNote] = React.useState(noteContent);

  const [isSaving, setIsSaving] = React.useState(false);
  const user = useAppSelector(selectUser);
  const { attemptId } = useParams<{ attemptId: string }>();

  React.useEffect(() => {
    setNote(noteContent);
  }, [noteContent]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);

    if (user) {
      setIsSaving(true);
      updateNote(e.target.value, attemptId, user.token, () => {
        setIsSaving(false);
      });
    }
  };

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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: "bold" }}>
            Notes
          </Typography>
          {isSaving ? (
            <CircularProgress
              sx={{ width: "24px !important", height: "24px !important" }}
            />
          ) : (
            <Typography sx={{ fontWeight: "bold" }} color="success.main">
              Saved!
            </Typography>
          )}
        </Box>
        <StyledTextArea autoFocus value={note} onChange={onChange} />
      </Stack>
    </Box>
  );
}
