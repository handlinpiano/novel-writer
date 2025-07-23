import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121', // Dark text - always readable
      secondary: '#424242', // Medium gray - still readable on light backgrounds
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: '#212121',
    },
    h2: {
      color: '#212121',
    },
    h3: {
      color: '#212121',
    },
    h4: {
      color: '#212121',
    },
    h5: {
      color: '#212121',
    },
    h6: {
      color: '#212121',
    },
    body1: {
      color: '#212121',
    },
    body2: {
      color: '#212121',
    },
    caption: {
      color: '#424242',
    },
    subtitle1: {
      color: '#212121',
    },
    subtitle2: {
      color: '#424242',
    },
  },
  components: {
    // Override MUI components to ensure good contrast
    MuiTypography: {
      styleOverrides: {
        root: {
          // Ensure text is always readable
          '&.MuiTypography-colorTextSecondary': {
            color: '#424242', // Darker secondary text
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          // Ensure text inside Paper components is readable
          '& .MuiTypography-colorTextSecondary': {
            color: '#424242',
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '&:before': {
            display: 'none', // Remove default divider
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
          '&:hover': {
            backgroundColor: '#eeeeee',
          },
        },
        content: {
          '& .MuiTypography-root': {
            color: '#212121', // Ensure accordion titles are dark
          },
        },
      },
    },
  },
});