import { Box } from "@mui/material";

export default function TopRainbowBar() {
  return (
    <Box sx={{ display: "flex", width: "100%", height: "8px" }}>
      {[
        "purple.main",
        "red.main",
        "yellow.main",
        "green.main",
        "blue.main",
        "violet.main",
      ].map((color) => (
        <Box key={color} sx={{ display: "flex", flex: "1" }} bgcolor={color} />
      ))}
    </Box>
  );
}
