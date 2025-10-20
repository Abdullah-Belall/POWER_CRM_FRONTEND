"use client";
import Snackbar from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";
import { Alert } from "@mui/material";
import {
  snakeBarState,
  SnakeBarTypeEnum,
  closeSnakeBar,
} from "@/app/utils/store/slices/snake-bar-slice";
import { useAppSelector, useAppDispatch } from "@/app/utils/store/hooks";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

const Msg = ({ msg, type }: { msg: string; type: SnakeBarTypeEnum }) => {
  return (
    <Alert
      severity={type}
      dir="ltr"
      sx={{
        "& .MuiAlert-icon": {
          margin: "0 6px 0 0",
        },
      }}
      style={{ fontFamily: "poppins" }}
    >
      {msg}
    </Alert>
  );
};

export default function CustomSnackbar() {
  const { isOpen, message, type } = useAppSelector(snakeBarState);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeSnakeBar());
  };

  return (
    <Snackbar
      open={isOpen}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      slots={{ transition: SlideTransition }}
      message={<Msg msg={message} type={type} />}
      key={message + Date.now()}
      autoHideDuration={3000}
      sx={{
        "& .MuiSnackbarContent-root": {
          backgroundColor: "transparent !important",
          boxShadow: "none !important",
          justifyContent: "start",
        },
      }}
    />
  );
}

// MuiPaper-root MuiPaper-elevation MuiPaper-elevation6 MuiSnackbarContent-root css-1wckuhe-MuiPaper-root-MuiSnackbarContent-root
