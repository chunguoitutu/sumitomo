"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  InputLabel,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DatePicker, { DateObject } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import Icons from "~/components/Icons";
import { DATA_DASHBOARD } from "~/ultis/constants/dashboard";
import { request } from "~/ultis/helper/request";

const Block = styled(Paper)(({ color }) => ({
  height: 200,
  lineHeight: "60px",
  padding: 10,
  borderRadius: "15px",
  backgroundColor: color,
}));

const Dashboard = () => {
  const [data, setData] = useState<any>({});
  const [dateTime, setDateTime] = useState({ from: "", to: "" });
  const [dataDate, setDataDate] = useState({});

  useEffect(() => {
    request("/summary", {
      method: "post",
      body: JSON.stringify(dataDate),
    })
      .then((res) => res.json())
      .then((res) => {
        if (Object.keys(res.data).length) {
          setData(res.data);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDate]);

  const handleSearch = (e: any, key: any) => {
    const value = new DateObject(e).format(`YYYY-MM-DD`);
    setDateTime((preState) => ({
      ...preState,
      [key]: value,
    }));
  };

  const handleSearchDate = () => {
    setDataDate(dateTime);
  };
  return (
    <Box>
      <Accordion sx={{ marginBottom: "16px" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            sx={{ fontWeight: "bold", color: "#4c4e64de" }}
            variant={"h5"}
          >
            Search Criteria
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={"grid grid-cols-2 gap-4 mb-4"}>
            <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
              <InputLabel>Date Range:</InputLabel>
              <Box display={"flex"} gap={"20px"}>
                <DatePicker
                  onChange={(e) => {
                    handleSearch(e, "from");
                  }}
                  containerClassName={
                    "w-full rounded [&>div>div>input]:w-full [&>div>div>input]:h-[55px]"
                  }
                  inputClass={
                    "h-[56px] w-full rounded border-[#ccc] border-[1px] border-[solid] py-[14.5px] px-[14px]"
                  }
                  format={"YYYY-MM-DD"}
                  range={false}
                  render={<InputIcon />}
                  placeholder={"from"}
                  calendarPosition={"bottom-end "}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icons name="rightArrow" />
                </Box>
                <DatePicker
                  onChange={(e) => {
                    handleSearch(e, "to");
                  }}
                  containerClassName={
                    "w-full rounded [&>div>div>input]:w-full [&>div>div>input]:h-[55px]"
                  }
                  inputClass={
                    "h-[56px] w-full rounded border-[#ccc] border-[1px] border-[solid] py-[14.5px] px-[14px]"
                  }
                  format={"YYYY-MM-DD"}
                  range={false}
                  render={<InputIcon />}
                  placeholder={"to"}
                  calendarPosition={"bottom-end "}
                />
              </Box>
            </Box>
          </Box>
          <Box className="flex justify-end w-full">
            <Button
              onClick={handleSearchDate}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, width: "300px" }}
            >
              Search
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Grid
        container
        spacing={3}
        className={"w-full"}
        justifyContent={true ? "space-between" : "center"}
      >
        {DATA_DASHBOARD.map((dt, index) => (
          <Grid key={index} item xs={3}>
            <Block elevation={3} color={dt.colorBackground}>
              <Typography variant="subtitle2" color={dt.colorText}>
                {dt.title}
              </Typography>
              <Box className="flex justify-center items-center h-[calc(100%_-_40px)]">
                <Typography
                  variant="h2"
                  fontWeight={"800"}
                  color={dt.colorText}
                >
                  {data && data[dt.key] ? data[dt.key] : 0}
                </Typography>
              </Box>
            </Block>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
