import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS

        },
        contained: {
          border: 0,
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
          color: 'white',
          height: 48,
          borderRadius: 24,
          padding: '0 30px',
        }


      },
    },

    MuiCard: {
      styleOverrides: {
        // Name of the slot
        root: {
          borderRadius: 24

        },

      }
    },


  }
});

export default theme;
