import { createTheme } from "@mui/material/styles";

export const createCustomTheme = () => {
  // Use consistent default values for both server and client to avoid hydration mismatches
  const defaultValues: { [key: string]: string } = {
    "--background": "#ffffff",
    "--dark-green": "#24574a",
    "--light-green": "#ffffff",
    "--font-poppins": "poppins",
  };

  const getCSSVariable = (variableName: string) => {
    // Always use default values to ensure consistency between server and client
    return defaultValues[variableName] || "#495057";
  };

  const darkgreen = getCSSVariable("--dark-green");
  const lightgreen = getCSSVariable("--light-green");
  const fontpoppins = getCSSVariable("--font-poppins");

  return createTheme({
    direction: "ltr",
    palette: {
      primary: {
        main: darkgreen,
        contrastText: lightgreen,
      },
      secondary: {
        main: darkgreen,
        contrastText: lightgreen,
      },
      text: {
        primary: darkgreen,
        secondary: darkgreen,
      },
      background: {
        default: lightgreen,
        paper: lightgreen,
      },
      action: {
        hover: "#ff0000",
      },
    },
    typography: {
      fontFamily: fontpoppins + " Arial, sans-serif",
      allVariants: {
        fontFamily: fontpoppins + " Arial, sans-serif",
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiFilledInput-root": {
              fontFamily: fontpoppins,
              "&:before": {
                borderBottomColor: darkgreen,
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottomColor: darkgreen,
              },
              "&:after": {
                borderBottomColor: darkgreen,
              },
            },
            "& .MuiInputLabel-root": {
              color: darkgreen,
              fontFamily: fontpoppins,
              caretColor: `${darkgreen} !important`,
              left: 0,
              right: "auto",
              transformOrigin: "top left",
              "&.Mui-focused": {
                color: `${darkgreen} !important`,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: `${darkgreen} !important`,
              caretColor: `${darkgreen} !important`,
              left: 0,
              right: "auto",
              transformOrigin: "top left",
            },
            "& .MuiInputLabel-root.MuiFormLabel-filled": {
              left: 0,
              right: "auto",
              caretColor: `${darkgreen} !important`,
              transformOrigin: "top left",
              color: darkgreen,
            },
            "& .MuiFilledInput-input": {
              caretColor: darkgreen,
              textAlign: "left",
              fontSize: "14px",
            },
            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled": {
              color: `${darkgreen} !important`,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: fontpoppins,
            textTransform: "none",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: fontpoppins,
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            "&.Mui-checked": {
              color: darkgreen,
            },
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            "&.Mui-checked": {
              color: darkgreen,
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            "& .MuiTypography-root": {
              fontFamily: fontpoppins,
            },
          },
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {
            "& .MuiSnackbarContent-root": {
              backgroundColor: "transparent !important",
              boxShadow: "none !important",
            },
          },
        },
      },
    },
  });
};
