import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  typography: {
    fontFamily: "'Saira', sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html {
          height: 100%;
        }

        body {
          height: 100%;
          & > #root {
            height: 100%;
          }
        }
      `,
    },
  },
});
theme = responsiveFontSizes(theme);

export default theme;
