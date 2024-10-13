import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles'; 
import Box from '@mui/material/Box';
import getSignUpTheme from '../shared-theme/getSignUpTheme';

function TemplateFrame({ mode, children }) {
  const signUpTheme = createTheme(getSignUpTheme(mode));

  return (
    <ThemeProvider theme={signUpTheme}>
      <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: '1 1', overflow: 'auto' }}>{children}</Box>
      </Box>
    </ThemeProvider>
  );
}


export default TemplateFrame;
