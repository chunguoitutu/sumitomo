import Typography from "@mui/material/Typography";
import { FULL_YEAR } from "~/ultis/constants/date";

const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {`Copyright © ${FULL_YEAR}.`}
    </Typography>
  );
};

export default Copyright;
