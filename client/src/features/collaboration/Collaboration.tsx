import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export default function Collaboration() {
  function handleEditorDidMount(editor: any, monaco: any) {
    const ydocument = new Y.Doc();
    const provider = new WebsocketProvider(
      "ws://localhost:5001",
      "monaco",
      ydocument
    );
    const type = ydocument.getText("monaco");

    // Bind Yjs to the editor model
    const monacoBinding = new MonacoBinding(
      type,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );
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
