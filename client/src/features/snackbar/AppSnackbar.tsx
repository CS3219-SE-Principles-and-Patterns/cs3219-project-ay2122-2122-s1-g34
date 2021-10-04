import { Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import React from "react";

import { useAppSelector } from "common/hooks/use-redux.hook";

import { useSnackbar } from "features/snackbar/use-snackbar.hook";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

export default function AppSnackbar() {
  const { close, exit } = useSnackbar();
  const { open, messageInfo } = useAppSelector((state) => state.snackbar);

  return (
    <Snackbar
      key={messageInfo?.key}
      anchorOrigin={{
        vertical: messageInfo?.vertical ?? "top",
        horizontal: messageInfo?.horizontal ?? "center",
      }}
      open={open}
      autoHideDuration={messageInfo?.autoHideDuration}
      onClose={close}
      TransitionProps={{
        onExited: exit,
      }}
    >
      <Alert onClose={close} severity={messageInfo?.severity}>
        {messageInfo?.message}
      </Alert>
    </Snackbar>
  );
}
