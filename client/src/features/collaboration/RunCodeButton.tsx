import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  IconButtonProps,
} from "@mui/material";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import React from "react";

import { useSocket } from "common/hooks/use-socket.hook";

interface RunCodeButtonProps
  extends Omit<IconButtonProps, "onClick" | "disabled"> {
  editorRef: React.MutableRefObject<
    monaco.editor.IStandaloneCodeEditor | undefined
  >;
}

export default function RunCodeButton({
  editorRef,
  ...rest
}: RunCodeButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const [runResult, setRunResult] = React.useState("");
  const { socket } = useSocket();

  const closeRunResult = () => {
    setRunResult("");
  };

  // display the value in ref in the dialog.
  // this ensures that when the dialog is transitioning
  // to a closed state, the output is still visible
  const runResultRef = React.useRef("");
  React.useEffect(() => {
    runResultRef.current = runResult;
  }, [runResult]);

  return (
    <>
      <Dialog open={runResult.length > 0} fullWidth>
        <DialogTitle>Output</DialogTitle>
        <DialogContent>
          <Box
            component="samp"
            sx={{
              width: "100%",
              height: "100%",
              display: "block",
              padding: 1,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "black",
            }}
          >
            {runResult.length > 0 ? runResult : runResultRef.current}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRunResult}>Close</Button>
        </DialogActions>
      </Dialog>
      <IconButton
        {...rest}
        disabled={loading}
        onClick={() => {
          if (socket && editorRef.current) {
            setLoading(true);
            socket.emit(
              "runCode",
              editorRef.current.getValue(),
              (result: string) => {
                setLoading(false);
                setRunResult(result);
              }
            );
          }
        }}
      >
        {loading ? (
          <CircularProgress
            sx={{ width: "24px !important", height: "24px !important" }}
          />
        ) : (
          <PlayCircleIcon color="success" />
        )}
      </IconButton>
    </>
  );
}
