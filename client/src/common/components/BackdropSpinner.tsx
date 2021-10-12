import { Backdrop, BackdropProps, CircularProgress } from "@mui/material";

export default function BackdropSpinner({ sx, ...rest }: BackdropProps) {
  return (
    <Backdrop
      {...rest}
      sx={{
        color: "primary.main",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ...(sx ?? {}),
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
