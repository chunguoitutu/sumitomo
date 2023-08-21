"use client";

import { Box } from "@mui/material";
import Dialog from "~/components/Dialog";
import Register from "~/components/RegisterUser";
import Table from "~/components/Table";
import { USER_TABLE_CONFIG } from "~/ultis/constants/user";

const Users = () => {
  return (
    <Box>
      <Table config={USER_TABLE_CONFIG}>
        <Box className={"flex justify-end mb-5"}>
          <Dialog
            label={"New User"}
            classes={{ scrollPaper: "!items-baseline" }}
          >
            <Register />
          </Dialog>
        </Box>
      </Table>
    </Box>
  );
};

export default Users;
