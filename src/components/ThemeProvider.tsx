'use client';

import React from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Just use MUI's default theme - it's perfectly fine!
const defaultTheme = createTheme();

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}