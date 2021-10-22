import Editor, { OnMount } from "@monaco-editor/react";
import { Box, BoxProps, Typography, Button } from "@mui/material";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import React from "react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";

import { useAppSelector } from "common/hooks/use-redux.hook";
import { useSocket } from "common/hooks/use-socket.hook";

import { SocketIoProvider } from "features/collaboration/y-socket-io.class";
import { selectPracticeSession } from "features/practice-session/practice-session.slice";

import RunCodeButton from "./RunCodeButton";

export interface CollaborativeEditorProps extends BoxProps {
  hasSubmitButton?: boolean;
  isSubmitButtonDisabled?: boolean;
  onSubmitButtonClick?: () => void;
  readOnly?: boolean;
  defaultValue?: string;
}

export default function CollaborativeEditor({
  sx,
  hasSubmitButton,
  isSubmitButtonDisabled,
  onSubmitButtonClick,
  defaultValue,
  readOnly,
  ...rest
}: CollaborativeEditorProps) {
  const practiceSession = useAppSelector(selectPracticeSession);

  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();
  const { socket } = useSocket();

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    if (readOnly) {
      editor.updateOptions({ readOnly: true });
    }

    if (socket && practiceSession.roomId && !readOnly) {
      const ydocument = new Y.Doc();
      const provider = new SocketIoProvider(socket, ydocument);
      const type = ydocument.getText(practiceSession.roomId);

      // Bind Yjs to the editor model
      new MonacoBinding(
        type,
        editor.getModel(),
        new Set([editor]),
        provider.awareness
      );
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 2,
        }}
      >
        <Typography variant="h6" fontWeight="600">
          Code
        </Typography>
        <RunCodeButton editorRef={editorRef} />
      </Box>
      <Editor
        defaultLanguage="javascript"
        onMount={handleEditorDidMount}
        defaultValue={defaultValue}
      />
      {hasSubmitButton && (
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
          onClick={onSubmitButtonClick}
          disabled={isSubmitButtonDisabled}
        >
          Submit
        </Button>
      )}
    </Box>
  );
}
