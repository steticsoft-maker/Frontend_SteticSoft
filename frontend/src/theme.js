import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: '#7635dc',
          },
          secondary: {
            main: '#f50057',
          },
          background: {
            default: '#f4f6f8',
            paper: '#ffffff',
          },
          text: {
            primary: '#212B36',
            secondary: '#637381',
          },
          success: {
            main: '#22c55e',
            light: '#dcfce7',
            dark: '#15803d',
            contrastText: '#ffffff',
          },
          error: {
            main: '#ef4444',
            light: '#fee2e2',
            dark: '#b91c1c',
            contrastText: '#ffffff',
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: '#7635dc',
          },
          secondary: {
            main: '#f50057',
          },
          background: {
            default: '#161c24',
            paper: '#212b36',
          },
          text: {
            primary: '#ffffff',
            secondary: '#919eab',
          },
          success: {
            main: '#22c55e',
            light: '#6ee7b7', // A lighter green for dark mode text
            dark: '#1c3a2e', // A darker green for dark mode background
            contrastText: '#ffffff',
          },
          error: {
            main: '#ef4444',
            light: '#fca5a5', // A lighter red for dark mode text
            dark: '#451a1a', // A darker red for dark mode background
            contrastText: '#ffffff',
          },
        }),
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 16,
          boxShadow: theme.palette.mode === 'light'
            ? 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px'
            : 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px',
        }),
      },
    },
     MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none',
            },
        },
    },
  },
});

export default theme;
