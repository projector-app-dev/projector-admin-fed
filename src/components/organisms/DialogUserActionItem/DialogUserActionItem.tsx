import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  GridActionsCellItem,
  type GridActionsCellItemProps,
} from "@mui/x-data-grid";
import { useState } from "react";

const DialogUserActionItem = ({
  deleteUser,
  title,
  buttonTitle,
  ...props
}: GridActionsCellItemProps & {
  title: string;
  buttonTitle: string;
  deleteUser: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <GridActionsCellItem {...props} onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Цю дію не можливо відмінити
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Відміна</Button>
          <Button
            onClick={() => {
              setOpen(false);
              deleteUser();
            }}
            color="warning"
            autoFocus
          >
            {buttonTitle}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogUserActionItem;
