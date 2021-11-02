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
import axios from "axios";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import React from "react";

import { useAppSelector } from "common/hooks/use-redux.hook";

import { selectUser } from "features/auth/user.slice";

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
  const [runResult, setRunResult] = React.useState<string | undefined>(
    undefined
  );
  const user = useAppSelector(selectUser);

  const closeRunResult = () => {
    setRunResult(undefined);
  };

  // display the value in ref in the dialog.
  // this ensures that when the dialog is transitioning
  // to a closed state, the output is still visible
  const runResultRef = React.useRef<string>();
  React.useEffect(() => {
    runResultRef.current = runResult;
  }, [runResult]);

  return (
    <>
      <Dialog open={runResult !== undefined} fullWidth>
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
              wordBreak: "break-all",
            }}
          >
            {runResult !== undefined ? runResult : runResultRef.current}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRunResult}>Close</Button>
        </DialogActions>
      </Dialog>
      <IconButton
        {...rest}
        disabled={loading}
        onClick={async () => {
          if (user && editorRef.current) {
            try {
              setLoading(true);
              const response = await axios.post<string>(
                "/code-runner",
                {
                  code: editorRef.current.getValue(),
                },
                { headers: { token: user.token } }
              );

              console.log(response.data);
              setRunResult(JSON.stringify(response.data));
            } finally {
              setLoading(false);
            }
          } else {
            console.error("User not signed in");
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
