import { createTheme, responsiveFontSizes } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface Palette {
    violet: Palette['primary'];
    purple: Palette['primary'];
    red: Palette['primary'];
    yellow: Palette['primary'];
    green: Palette['primary'];
    blue: Palette['primary'];
    orange: Palette['primary'];
    lightGray: Palette['primary'];
    gray: Palette['primary'];
    black: Palette['primary'];
  }
  interface PaletteOptions {
    violet: PaletteOptions['primary'];
    purple: PaletteOptions['primary'];
    red: PaletteOptions['primary'];
    yellow: PaletteOptions['primary'];
    green: PaletteOptions['primary'];
    blue: PaletteOptions['primary'];
    orange: PaletteOptions['primary'];
    lightGray: PaletteOptions['primary'];
    gray: PaletteOptions['primary'];
    black: PaletteOptions['primary'];
  }
  type PaletteColors = 'violet' | 'purple'  | 'red' | 'yellow' | 'green' | 'blue' | 'orange' | 'lightGray' | 'gray' | 'black';
}


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
    MuiButton: {
      styleOverrides: {
        contained: {
          'boxShadow': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          '&:hover': {
            'backgroundColor': 'lightgray',
            'color': '#313030',
            'boxShadow': '0 5px 8px rgba(0,0,0,0.22), 0 5px 6px rgba(0,0,0,0.23)',
         },
        },
        text: {
          '&:hover': {
            'backgroundColor': 'transparent',
            'fontWeight': '700',
         },
        },
      },
    },
    MuiTypography: {
      styleOverrides: { 
        root: {
          'color': '#313030'
        }
      }

    }
  },
  palette: {
    primary: {
      main: '#5F4BA8',
      contrastText: '#fff',
    },
    violet: {
      main: '#5F4BA8',
      contrastText: '#fff',
    },
    purple: {
      main: '#CAACCF',
      contrastText: '#fff',
    },
    red: {
      main: '#D84A4A',
      contrastText: '#fff',
    },
    yellow: {
      main: '#ECD679',
      contrastText: '#fff',
    },
    green: {
      main: '#579A70',
      contrastText: '#fff',
    },
    blue: {
      main: '#67A0AC',
      contrastText: '#fff',
    },
    orange: {
      main: '#DB7D58',
      contrastText: '#fff',
    },
    lightGray: {
      main: '#ECECEC',
      contrastText: '#fff',
    },
    gray: {
      main: '#BCBCBC',
      contrastText: '#fff',
    },
    black: {
      main: '#313030',
      contrastText: '#fff',
    }
  },
});
theme = responsiveFontSizes(theme);

export default theme;
