import Editor, { OnMount } from "@monaco-editor/react";
import { Box, BoxProps, Typography, TextField, Button } from "@mui/material";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import React, { useState } from "react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";

import { useSocket } from "common/hooks/use-socket.hook";

import RunCodeButton from "features/collaboration/RunCodeButton";
import { SocketIoProvider } from "features/collaboration/y-socket-io.class";
import { PracticeSession } from "features/practice-session/practice-session.interface";

export interface CollaborativeEditorProps extends BoxProps {
  defaultValue?: string;
  practiceSession?: PracticeSession;
  readOnly?: boolean;
}

export default function CollaborativeEditor({
  defaultValue,
  practiceSession,
  readOnly,
  sx,
  ...rest
}: CollaborativeEditorProps) {
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();
  const { socket } = useSocket();
  const [userAnswer, setUserAnswer] = useState(
    readOnly ? practiceSession?.question.answer : ""
  );
  const [isUserAnswerCorrect, setIsUserAnswerCorrect] = useState(false);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    if (readOnly) {
      editor.updateOptions({ readOnly: true });
    }

    if (socket && practiceSession?.id && !readOnly) {
      const ydocument = new Y.Doc();
      const provider = new SocketIoProvider(socket, ydocument);
      const type = ydocument.getText(practiceSession.id);

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
        <TextField
          id="user-answer-textfield"
          variant="outlined"
          fullWidth
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Check answer"
          disabled={readOnly}
          sx={{
            display: "flex",
            marginX: 14,
            borderRadius: 8,
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: isUserAnswerCorrect ? "green.main" : "violet.main",
              },
          }}
          InputProps={
            !readOnly
              ? {
                  endAdornment: (
                    <Button
                      variant="contained"
                      size="small"
                      type="submit"
                      sx={{
                        borderRadius: 4,
                        paddingX: 1,
                        marginLeft: 1,
                        fontSize: 16,
                        fontWeight: "regular",
                        color: "lightGray.main",
                        backgroundColor: "violet.main",
                        textTransform: "none",
                      }}
                      onClick={checkAnswerIsCorrect}
                    >
                      Check
                    </Button>
                  ),
                }
              : undefined
          }
        />

        <RunCodeButton editorRef={editorRef} />
      </Box>
      <Editor
        defaultLanguage="javascript"
        onMount={handleEditorDidMount}
        defaultValue={defaultValue}
      />
    </Box>
  );

  function checkAnswerIsCorrect() {
    setIsUserAnswerCorrect(userAnswer === practiceSession?.question.answer);
  }
}
