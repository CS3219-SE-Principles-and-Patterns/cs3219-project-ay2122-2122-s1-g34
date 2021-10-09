import Editor from "@monaco-editor/react";
import { Box } from "@mui/material";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";

import { useSocket } from "common/hooks/use-socket.hook";

import { SocketIoProvider } from "./y-socket-io.class";

export default function Collaboration() {
  const { socket } = useSocket();
  function handleEditorDidMount(editor: any, monaco: any) {
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
      sx={{
        height: "90vh",
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
        height="90vh"
        defaultLanguage="javascript"
        onMount={handleEditorDidMount}
      />
    </Box>
  );
}
