"use client";
import { useState } from "react";

import Button from "@mui/material/Button";
import { Box, Dialog as MuiDialog } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { pink } from "@mui/material/colors";

import { useSelector } from "react-redux";
import { RootState } from "~/ultis/slices/store";
import { useNotification } from "~/hooks/use-notification";
import CADialog from "~/components/Dialog/confirm-dialog";
import Register from "~/components/RegisterUser";
import { request } from "~/ultis/helper/request";

const ButtonFormat = ({ row }: any) => {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { showNotification } = useNotification();

  const check: any = (row: any) => {
    if (userInfo?.roles[0] == "superadmin") {
      return true;
    }
    if (userInfo?.roles[0] == "user" && row.email == userInfo?.email) {
      return true;
    }
    if (userInfo?.roles[0] == "admin" && row.roles[0] == "user") {
      return true;
    }
    if (userInfo?.roles[0] == "admin" && row.email == userInfo?.email) {
      return true;
    }
    return false;
  };

  const handleClick = (row: any, action: any) => {
    if (action == "Delete") {
      setOpenDialog(true);
    } else {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setOpenDialog(false);
  };

  const handleDelete = () => {
    request(`/user/${row._id}`, {
      method: "delete",
    }).then((res) =>
      res.json().then((res) => {
        if (!res.error) {
          window.location.reload();
          handleClose();
        } else {
          showNotification({
            title: res.message,
            type: "error",
          });
        }
      })
    );
  };

  const action = row.action.map((action: any, index: any) => {
    if (action == "Delete" && row.email == userInfo?.email) {
      return <div key={index}></div>;
    }
    if (action == "Edit") {
      return (
        <Button
          key={index}
          onClick={() => handleClick(row, action)}
          disabled={!check(row)}
        >
          <EditIcon />
        </Button>
      );
    }
    if (action == "Delete") {
      return (
        <Button
          key={index}
          onClick={() => handleClick(row, action)}
          disabled={!check(row)}
        >
          <DeleteForeverIcon
            sx={(check(row), true ? { color: pink[500] } : {})}
          />
        </Button>
      );
    }
  });
  return (
    <Box>
      {openDialog ? (
        <CADialog
          handleClose={handleClose}
          handleDelete={handleDelete}
          openDialog={openDialog}
          content="Do you really want to delete this account?"
        />
      ) : (
        <></>
      )}
      {action}
      {row != "" ? (
        <MuiDialog open={open} onClose={handleClose}>
          <Register infos={row} />
        </MuiDialog>
      ) : (
        <> </>
      )}
    </Box>
  );
};

export default ButtonFormat;
