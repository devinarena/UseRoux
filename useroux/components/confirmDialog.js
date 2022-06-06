/**
 * @file confirmDialog.js
 * @author Devin Arena
 * @since 1/10/2022
 * @description Asks the user if they wish to proceed with an option using MUI alerts.
 */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

const ConfirmDialog = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="confirm-dialog"
      aria-describedby="confirm-dialog"
    >
      <DialogTitle id="confirmDialog">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmDialogDescription">
          {props.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={() => props.setOpen(false)}>
          Cancel
        </Button>
        <Button
          variant="text"
          onClick={() => {
              props.action();
              props.setOpen(false);
          }}
          autoFocus
          color={props.danger ? "error" : "inherit"}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
