"use client";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { createCustomTheme } from "./theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  // Create theme only once to avoid hydration mismatches
  const theme = createCustomTheme();

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
