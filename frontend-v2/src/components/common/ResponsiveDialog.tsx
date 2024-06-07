import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useAppSelector } from "@redux/hooks";
import { translate } from "@constants/lang";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { useTheme } from "@mui/material/styles";

interface IResponsiveDialogProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  content?: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  confirmColor?:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "inherit"
    | undefined;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  closeOnly?: boolean;
}
const ResponsiveDialog: React.FC<IResponsiveDialogProps> = ({
  open,
  onClose,
  title,
  content,
  onConfirm,
  confirmText,
  confirmColor = "primary",
  maxWidth = "xl",
  closeOnly = false,
}) => {
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const langState = useAppSelector((state) => state.lang.langKey);

  return (
    <Dialog
      // fullScreen={fullScreen}
      open={open}
      maxWidth={maxWidth ?? "xl"}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title ?? "title"}</DialogTitle>
      <DialogContent>{content ?? "content"}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} variant="contained">
          {closeOnly
            ? translate("Close", langState)
            : translate("Cancel", langState)}
        </Button>
        {!closeOnly && (
          <Button
            onClick={onConfirm ?? onClose}
            autoFocus
            color={confirmColor}
            variant="contained"
          >
            {confirmText ?? "OK"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ResponsiveDialog;
