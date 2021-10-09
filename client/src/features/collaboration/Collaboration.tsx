import Editor from "@monaco-editor/react";
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
      const monacoBinding = new MonacoBinding(
        type,
        editor.getModel(),
        new Set([editor]),
        provider.awareness
      );
    }
  }

  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      onMount={handleEditorDidMount}
    />
  );
}
