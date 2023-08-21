"use client";

import { useState, useEffect } from "react";

import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { get, uniq } from "lodash";

import { Button, Checkbox } from "@mui/material";
import { EtableConfigType } from "~/ultis/types/etable-config";
import { convertRowValue } from "~/ultis/helper/table";
import { SearchCriteria } from "./search-criteria";
import { request } from "~/ultis/helper/request";

const Table = ({
  config,
  endpoint,
  children,
}: {
  config: EtableConfigType;
  endpoint?: string;
  children?: any;
}) => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState([]);
  const [listInvoiceDelete, setListInvoiceDelete] = useState<any>([]);
  const [deleting, setDeleting] = useState<Boolean>(false);
  const [isCheckAll, setIsCheckAll] = useState<Boolean>(false);
  const colAlignCenter = ["totalTemplates"];
  const [isClickSearch, setIsClickSearch] = useState<Boolean>(false);
  const [totalSearch, setTotalSearch] = useState<Number>(0);

  const searchLS: any = [];

  useEffect(() => {
    request(config.endpoint || "", {
      method: "post",
      body: JSON.stringify({
        pagination: {
          page: page + 1,
          rowsPerPage,
        },
        filters: searchLS.length > 0 ? searchLS : filters,
        isSearch: isClickSearch,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          setRows(res.data.rows);
          setTotal(res.data.pagination.total);
          if (isClickSearch) {
            setPage(0);
          }
        }
        const fakeRows: any = [];
        if (location.pathname == "/users") {
          res?.data?.rows.forEach((el: any, index: any) => {
            fakeRows[index] = { ...el, action: ["Edit", "Delete"] };
          });
          setRows(fakeRows);
        }

        const checkToSetTick = (res.data.rows || []).every((el: any) =>
          listInvoiceDelete.includes(el?._id)
        );
        checkToSetTick && res.data.rows?.length
          ? setIsCheckAll(true)
          : setIsCheckAll(false);
        setIsClickSearch(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filters]);

  const handleChangePage = (_: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //   const handleRefeshData = () => {
  //     request
  //       .post(endpoint || config.endpoint || "", {
  //         pagination: {
  //           page: page + 1,
  //           rowsPerPage,
  //         },
  //         filters: searchLS.length > 0 ? searchLS : filters,
  //       })
  //       .then((res) => {
  //         if (!res.data.error) {
  //           setRows(res.data.data.rows);
  //           setTotal(res.data.data.pagination.total);
  //         }
  //       });
  //   };

  const handleCheckAll = () => {
    if (rows) {
      setListInvoiceDelete((prev: any) => {
        return uniq([...prev, ...rows.map((el: any) => el?._id)]);
      });
    }
    if (isCheckAll) {
      rows.forEach((row: any) => {
        setListInvoiceDelete((prev: any) => {
          return prev.filter((el: any) => el != row?._id);
        });
      });
    }
    setIsCheckAll(!isCheckAll);
  };

  const handleCheckBox = (id: any) => {
    if (listInvoiceDelete.includes(id)) {
      setListInvoiceDelete((prev: any) => {
        return prev.filter((el: any) => el != id);
      });
    } else {
      setListInvoiceDelete([...listInvoiceDelete, id]);
    }
  };
  const headersRender = config.colDefs.map((el) => {
    if (el.colId == "checkBox") {
      return (
        <TableCell key={el.colId}>
          <Checkbox
            color="primary"
            onChange={handleCheckAll}
            defaultChecked={isCheckAll ? true : false}
            checked={isCheckAll ? true : false}
          />
        </TableCell>
      );
    }
    return <TableCell key={el.colId}>{el.title}</TableCell>;
  });

  const rowsRender = rows.map((row: any) => {
    return (
      <TableRow
        key={row._id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        {config.colDefs.map((cellConfig: any) => {
          const CellComponent = cellConfig.component;
          if (CellComponent) {
            if (cellConfig.colId == "actionDelete") {
              return (
                <TableCell align="left" key={cellConfig.colId}>
                  <CellComponent
                    key={cellConfig.colId}
                    id={row._id}
                    // refreshData={handleRefeshData}
                  />
                </TableCell>
              );
            }
            return (
              <TableCell align="left" key={cellConfig.colId}>
                <CellComponent
                  key={cellConfig.colId}
                  cellConfig={cellConfig}
                  row={row}
                />
              </TableCell>
            );
          }
          if (cellConfig.colId == "checkBox") {
            return (
              <TableCell align="left" key={cellConfig.colId}>
                <Checkbox
                  color="primary"
                  onChange={() => handleCheckBox(row._id)}
                  checked={listInvoiceDelete.includes(row._id)}
                />
              </TableCell>
            );
          }
          return (
            <TableCell
              align={
                colAlignCenter.includes(cellConfig.colId) ? "center" : "left"
              }
              key={cellConfig.colId}
            >
              {convertRowValue(row[cellConfig.colId], cellConfig.type)}
            </TableCell>
          );
        })}
      </TableRow>
    );
  });

  //   const handleDeleteMuiltiInvoice = () => {
  //     const noti = confirm("Do you want to remove invoices?");
  //     if (noti) {
  //       setDeleting(true);
  //       request
  //         .delete("/invoice/multiple/delete", {
  //           data: {
  //             list: listInvoiceDelete,
  //           },
  //         })
  //         .then((res) => {
  //           if (!res.data.error) {
  //             setDeleting(false);
  //             handleRefeshData();
  //             setListInvoiceDelete([]);
  //           }
  //         })
  //         .catch((e) => {
  //           setDeleting(false);
  //           console.log("Error Delete: ", e.message);
  //         });
  //     }
  //   };

  return (
    <Box>
      {children}
      <SearchCriteria
        colDefs={config.colDefs}
        setFilters={setFilters}
        keyCriteria={config.keySearch}
        setIsClick={setIsClickSearch}
        totalSearch={totalSearch}
      />
      {listInvoiceDelete.length ? (
        <Button
          variant="contained"
          style={{ marginBottom: "15px" }}
          color="error"
          //   onClick={handleDeleteMuiltiInvoice}
          disabled={deleting ? true : false}
        >
          {`Delete ${listInvoiceDelete.length} Invoice`}
        </Button>
      ) : null}
      <Paper
        className={
          "pb-3 border-[1px] border-solid border-[#4c4e641f] rounded-[15px]"
        }
      >
        <TableContainer>
          <MuiTable sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#F5F5F7" }}>
              <TableRow>{headersRender}</TableRow>
            </TableHead>
            <TableBody>{rowsRender}</TableBody>
          </MuiTable>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default Table;
