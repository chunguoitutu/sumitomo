"use client";

import { useState, cloneElement } from "react";
import { Button, Dialog as MuiDialog, Typography } from "@mui/material";

const Dialog = ({ label = "Open Dialog", children, ...rest }: any) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClick}>
        {label}
      </Button>
      <MuiDialog open={open} onClose={handleClose} {...rest}>
        {cloneElement(children, { handleClose })}
      </MuiDialog>
    </div>
  );
};

export default Dialog;
