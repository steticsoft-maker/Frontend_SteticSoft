import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import theme from './theme';
import Dashboard from './pages/Dashboard.jsx';
import UsersList from './pages/UsersList.jsx';

function App() {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const activeTheme = useMemo(() => theme(mode), [mode]);

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
            {activeTheme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        <main>
          <Dashboard />
          <UsersList />
        </main>
      </Box>
    </ThemeProvider>
  );
}

export default App;
