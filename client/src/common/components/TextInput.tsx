import { TextField, TextFieldProps } from "@mui/material";

export default function TextInput({ ...rest }: TextFieldProps) {
  return (
    <TextField
      {...rest}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 4,
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "black.main",
          },
      }}
    />
  );
}
