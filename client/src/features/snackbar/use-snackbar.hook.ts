import React from "react";

import { useAppDispatch, useAppSelector } from "common/hooks/use-redux.hook";

import {
  setMessageInfo,
  setOpen,
  pushToSnackpack,
  shiftSnackpack,
  SnackbarMessage,
} from "features/snackbar/snackbar.slice";

export function useSnackbar() {
  const dispatch = useAppDispatch();
  const {
    open: isOpen,
    snackPack,
    messageInfo,
  } = useAppSelector((state) => state.snackbar);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      dispatch(setMessageInfo({ ...snackPack[0] }));
      dispatch(shiftSnackpack());
      dispatch(setOpen(true));
    }
  }, [snackPack, messageInfo, isOpen, dispatch]);

  const open = (options: SnackbarMessage) => {
    const newMessage: SnackbarMessage = {
      message: options.message,
      severity: options.severity ?? "success",
      vertical: options.vertical ?? "top",
      horizontal: options.horizontal ?? "center",
      autoHideDuration: options.autoHideDuration ?? 6000,
      key: new Date().getTime(),
    };

    dispatch(pushToSnackpack(newMessage));
  };

  const close = () => {
    dispatch(setOpen(false));
  };

  const exit = () => {
    dispatch(setMessageInfo(undefined));
  };

  return { open, close, exit };
}
