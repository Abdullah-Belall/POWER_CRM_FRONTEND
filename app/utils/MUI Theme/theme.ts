import { createTheme } from "@mui/material/styles";
import { useAppSelector } from "../store/hooks";
import { getCurrLang } from "../store/slices/languages-slice";

export const CreateCustomTheme = () => {
  // Use consistent default values for both server and client to avoid hydration mismatches
  const defaultValues: { [key: string]: string } = {
    "--background": "#ffffff",
    "--dark-green": "#378600",
    "--light-green": "#ffffff",
    "--font-cairo": "cairo",
  };

  const getCSSVariable = (variableName: string) => {
    // Always use default values to ensure consistency between server and client
    return defaultValues[variableName] || "#495057";
  };

  const darkgreen = getCSSVariable("--dark-green");
  const lightgreen = getCSSVariable("--light-green");
  const fontcairo = getCSSVariable("--font-cairo");
  const currLang = useAppSelector(getCurrLang());

  return createTheme({
    direction: currLang === "ar" ? "rtl" : "ltr",
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
      fontFamily: fontcairo + " Arial, sans-serif",
      allVariants: {
        fontFamily: fontcairo + " Arial, sans-serif",
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiFilledInput-root": {
              fontFamily: "cairo",
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
              fontFamily: "cairo",
              caretColor: `${darkgreen} !important`,
              right: currLang === "ar" ? 16 : "auto",
              left: currLang === "ar" ? "auto" : "auto",
              transformOrigin: `top ${currLang === "ar" ? "right" : "left"}`,
              marginLeft: currLang === "en" ? 0 : "unset",
              "&.Mui-focused": {
                color: `${darkgreen} !important`,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: `${darkgreen} !important`,
              caretColor: `${darkgreen} !important`,
              right: currLang === "ar" ? 16 : "auto",
              left: currLang === "ar" ? "auto" : "auto",
              transformOrigin: currLang === "ar" ? "top right" : "top left",
              marginLeft: currLang === "en" ? 0 : "unset",
            },
            "& .MuiInputLabel-root.MuiFormLabel-filled": {
              right: currLang === "ar" ? 16 : "auto",
              left: currLang === "ar" ? "auto" : "auto",
              caretColor: `${darkgreen} !important`,
              transformOrigin: currLang === "ar" ? "top right" : "top left",
              color: darkgreen,
              marginLeft: currLang === "en" ? 0 : "unset",
            },
            "& .MuiFilledInput-input": {
              caretColor: darkgreen,
              textAlign: currLang === "ar" ? "right" : "left",
              fontSize: "14px",
            },
            "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled": {
              color: `${darkgreen} !important`,
            },
          },
        },
      },
      // MuiSelect: {
      //   styleOverrides: {
      //     root: ({ theme, ownerState }) => ({
      //       fontFamily: "Cairo, sans-serif",
      //       "& .MuiFilledInput-root": {
      //         backgroundColor: "transparent",
      //         "&:before": {
      //           borderBottomColor: "darkgreen",
      //         },
      //         "&:hover:not(.Mui-disabled):before": {
      //           borderBottomColor: "darkgreen",
      //         },
      //         "&:after": {
      //           borderBottomColor: "darkgreen",
      //         },
      //       },

      //       "& .MuiSelect-filled.MuiFilledInput-input": {
      //         textAlign: ownerState.currLang === "ar" ? "right" : "left",
      //         fontSize: "14px",
      //         caretColor: "darkgreen",
      //       },

      //       "& .MuiInputLabel-root": {
      //         color: "darkgreen",
      //         fontFamily: "Cairo, sans-serif",
      //         transformOrigin: ownerState.currLang === "ar" ? "top right" : "top left",
      //         right: ownerState.currLang === "ar" ? 16 : "auto",
      //         left: ownerState.currLang === "ar" ? "auto" : 16,
      //         "&.Mui-focused": {
      //           color: "darkgreen !important",
      //         },
      //       },
      //       "& .MuiSelect-icon": {
      //         color: "darkgreen",
      //         right: ownerState.currLang === "ar" ? "auto" : 8,
      //         left: ownerState.currLang === "ar" ? 8 : "auto",
      //       },
      //     }),
      //   },
      // },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: fontcairo,
            textTransform: "none",
          },
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          root: {
            flexDirection: currLang === "ar" ? "row-reverse" : "row",
          },
          grouped: {
            "&:not(:last-of-type)": {
              borderTopLeftRadius: "0",
              borderBottomLeftRadius: "0",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",
              borderLeft: "none",
              borderRight: "none",
            },
            "&:not(:first-of-type)": {
              borderTopLeftRadius: "0",
              borderBottomLeftRadius: "0",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",
            },
            "&:first-of-type": {
              borderTopLeftRadius: "4px",
              borderBottomLeftRadius: "4px",
            },
            "&:last-of-type": {
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: fontcairo,
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
              fontFamily: fontcairo,
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
