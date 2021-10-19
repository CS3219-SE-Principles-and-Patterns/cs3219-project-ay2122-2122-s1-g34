import Editor from "@monaco-editor/react";
import { Box, BoxProps, Typography, Button } from "@mui/material";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";

import { useAppDispatch } from "common/hooks/use-redux.hook";
import { useSocket } from "common/hooks/use-socket.hook";

import { SocketIoProvider } from "features/collaboration/y-socket-io.class";

import { setHasClickedOnSubmitSession } from "../practice-session/practice-session.slice";

interface CollaborativeEditorProps extends BoxProps {
  hasSaveButton?: boolean;
}

export default function CollaborativeEditor({
  sx,
  hasSaveButton,
  ...rest
}: CollaborativeEditorProps) {
  const dispatch = useAppDispatch();

  const { socket } = useSocket();
  function handleEditorDidMount(editor: any) {
    if (socket) {
      const ydocument = new Y.Doc();
      const provider = new SocketIoProvider(socket, ydocument);
      const type = ydocument.getText("monaco");

      // Bind Yjs to the editor model
      new MonacoBinding(
        type,
        editor.getModel(),
        new Set([editor]),
        provider.awareness
      );
    }
  }

  return (
    <Box
      {...rest}
      sx={{
        ...(sx ?? {}),
        borderRadius: 3,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "violet.main",
        padding: 2,
        display: "flex",
        position: "relative",
        flexDirection: "column",
        "& .yRemoteSelection": {
          backgroundColor: "rgb(250, 129, 0, .5)",
        },
        "& .yRemoteSelectionHead": {
          position: "absolute",
          borderLeft: "orange solid 2px",
          borderTop: "orange solid 2px",
          borderBottom: "orange solid 2px",
          height: "100%",
          boxSizing: "border-box",
        },
        "& .yRemoteSelectionHead::after": {
          position: "absolute",
          content: '" "',
          border: "3px solid orange",
          borderRadius: "4px",
          left: "-4px",
          top: "-5px",
        },
      }}
    >
      <Typography variant="h6" fontWeight="600" sx={{ paddingBottom: 2 }}>
        Code
      </Typography>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        onMount={handleEditorDidMount}
      />

      {hasSaveButton && (
        <Button
          variant="contained"
          size="small"
          sx={{
            position: "absolute",
            borderRadius: 40,
            paddingX: 2,
            fontSize: 18,
            fontWeight: "regular",
            color: "lightGray.main",
            backgroundColor: "green.main",
            textTransform: "none",
            bottom: 10,
            right: 10,
            zIndex: 50,
          }}
          onClick={onSaveButtonClick}
        >
          Submit
        </Button>
      )}
    </Box>
  );

  function onSaveButtonClick() {
    dispatch(setHasClickedOnSubmitSession(true));
  }
}
