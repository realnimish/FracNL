import { IconButton } from "@mui/material";
import { Close as IconClose } from "@mui/icons-material";
import { useSnackbar } from "notistack";
export default function SnackbarCloseButton({ snackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)}>
      <IconClose sx={{ color: "white" }} />
    </IconButton>
  );
}