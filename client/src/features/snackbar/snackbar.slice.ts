import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SnackbarMessage {
  message: string;
  severity?: "error" | "warning" | "info" | "success";
  vertical?: "top" | "bottom";
  horizontal?: "left" | "right" | "center";
  autoHideDuration?: number;
  key?: number;
}

export interface ISnackbar {
  open: boolean;
  snackPack: SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}

const initialState: ISnackbar = {
  open: false,
  snackPack: [],
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setMessageInfo: (
      state,
      action: PayloadAction<SnackbarMessage | undefined>
    ) => {
      state.messageInfo = action.payload;
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    pushToSnackpack: (state, action: PayloadAction<SnackbarMessage>) => {
      state.snackPack.push(action.payload);
    },
    shiftSnackpack: (state) => {
      state.snackPack.shift();
    },
  },
});

export const { setMessageInfo, setOpen, pushToSnackpack, shiftSnackpack } =
  snackbarSlice.actions;

export default snackbarSlice.reducer;
