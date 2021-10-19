import { Box, Typography, useTheme, PaletteColors } from "@mui/material";

interface DashboardCardProps {
  outlineColor: PaletteColors;
  title: string;
  subtitle: string;
  disabled?: boolean;
  onCardClick?: () => void;
  component?: any;
  to?: string;
}
export default function DashboardCard({
  outlineColor,
  title,
  subtitle,
  disabled = false,
  onCardClick,
  component,
  to,
}: DashboardCardProps) {
  const themePalette = useTheme().palette;

  const disabledStyle = !disabled
    ? {
        boxShadow: `-4px 4px 3px ${themePalette[outlineColor].main}`,
      }
    : {
        backgroundColor: `${themePalette.lightGray.main}`,
      };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        borderWidth: 2,
        borderStyle: "solid",
        height: 240,
        width: 240,
        ...disabledStyle,
        justifyContent: "center",
        cursor: "pointer",
        textDecoration: "none",
      }}
      borderColor={`${outlineColor}.main`}
      onClick={onCardClick}
      component={component}
      to={to}
    >
      <Typography gutterBottom fontWeight={"bold"}>
        {title}
      </Typography>
      <Typography>{subtitle}</Typography>
    </Box>
  );
}
