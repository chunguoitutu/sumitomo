import { Formik } from "formik";
import { useMemo } from "react";
import { get } from "lodash";

import {
  Box,
  InputLabel,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ColDefsType } from "~/ultis/types/etable-config";

import Text from "./filter-components/text";

const TextFieldItem = ({
  col,
  onChange,
  setFieldValue,
  getFieldProps,
  search,
  values,
}: {
  col: ColDefsType;
  onChange: any;
  setFieldValue: any;
  getFieldProps: any;
  search?: any;
  values?: any;
}) => {
  const Component = useMemo(() => {
    if (get(col, "filterComponent", null)) {
      return get(col, "filterComponent", null);
    }

    return Text;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <InputLabel>{col.title}</InputLabel>
      <Component
        col={col}
        values={values}
        setFieldValue={setFieldValue}
        getFieldProps={getFieldProps}
      />
    </Box>
  );
};

export const SearchCriteria = ({
  colDefs,
  setFilters,
  keyCriteria,
  setIsClick,
  totalSearch = 0,
}: {
  colDefs: ColDefsType[];
  setFilters: any;
  keyCriteria?: any;
  setIsClick?: Function;
  totalSearch?: Number;
}) => {
  const colDefsFilters = colDefs.filter((el) => !!el.filter);
  const ignoreField = ["actionDelete", "checkBox"];

  if (colDefsFilters.length === 0) return null;

  const search = JSON.parse(String(localStorage.getItem("searchCriteria")));
  const searchLS = get(search, `${keyCriteria}`, []);

  const init = searchLS.reduce((a: any, b: any) => {
    return {
      ...a,
      [b.field]: b.value,
    };
  }, {});

  return (
    <Accordion sx={{ marginBottom: "16px" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{ fontWeight: "bold", color: "#4c4e64de" }}
          variant={"h5"}
        >
          Search Criteria
        </Typography>
        {totalSearch ? (
          <div className="rounded-[50%] ml-[12px] bg-[red] w-[20px] h-[20px] p-3 text-[12px] flex justify-center items-center font-bold text-[#fff]">{` ${totalSearch}`}</div>
        ) : null}
      </AccordionSummary>
      <AccordionDetails>
        <Formik
          initialValues={init}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              const filters = Object.keys(values).map((el) => {
                const colDef = colDefs.find((item) => item.colId === el);
                return {
                  field: el,
                  dataType: colDef?.filter?.type,
                  operator: colDef?.filter?.operator,
                  value: values[el],
                };
              });
              if (keyCriteria) {
                if (setIsClick) {
                  setIsClick(true);
                }
                localStorage.setItem(
                  "searchCriteria",
                  JSON.stringify({
                    ...search,
                    [keyCriteria]: filters,
                  })
                );
              }
              setFilters(filters);
              setSubmitting(false);
            }, 400);
          }}
        >
          {({
            handleSubmit,
            handleChange,
            setFieldValue,
            isSubmitting,
            getFieldProps,
            values,
          }) => (
            <Box component="form" onSubmit={handleSubmit}>
              <Box className={"flex justify-end"}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, width: "300px" }}
                  disabled={isSubmitting}
                >
                  Search
                </Button>
              </Box>
              <Box className={"grid grid-cols-4 gap-4 mb-4"}>
                {colDefsFilters
                  .filter((el) => !ignoreField.includes(el.colId))
                  .map((col) => {
                    return (
                      <TextFieldItem
                        key={col.colId}
                        col={col}
                        onChange={handleChange}
                        setFieldValue={setFieldValue}
                        getFieldProps={getFieldProps}
                        search={searchLS}
                        values={values}
                      />
                    );
                  })}
              </Box>
            </Box>
          )}
        </Formik>
      </AccordionDetails>
    </Accordion>
  );
};
