import { Box } from "@mui/material";

export default function TopRainbowBar() {
  return (
    <Box sx={{ display: "flex", width: "100%", height: "8px" }}>
      <Box sx={{ display: "flex", flex: "1" }} bgcolor={"purple.main"} />
      <Box sx={{ display: "flex", flex: "1" }} bgcolor={"red.main"} />
      <Box sx={{ display: "flex", flex: "1" }} bgcolor={"yellow.main"} />
      <Box sx={{ display: "flex", flex: "1" }} bgcolor={"green.main"} />
      <Box sx={{ display: "flex", flex: "1" }} bgcolor={"blue.main"} />
      <Box sx={{ display: "flex", flex: "1" }} bgcolor={"violet.main"} />
    </Box>
  );
}
