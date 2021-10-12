import Editor from "@monaco-editor/react";
import { Box, BoxProps } from "@mui/material";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";

import { useSocket } from "common/hooks/use-socket.hook";

import { SocketIoProvider } from "features/collaboration/y-socket-io.class";

interface CollaborativeEditorProps extends BoxProps {}

export default function CollaborativeEditor({
  sx,
  ...rest
}: CollaborativeEditorProps) {
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
        borderColor: "#5F4BA8",
        padding: 2,
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
      <Editor
        height="100%"
        defaultLanguage="javascript"
        onMount={handleEditorDidMount}
      />
    </Box>
  );
}
