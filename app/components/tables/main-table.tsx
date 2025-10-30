"use client";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";

export default function MainTable({
  rows,
  columns,
  onRowClick,
  hieght,
}: {
  columns: any[];
  rows: any[];
  onRowClick?: (data: any) => void;
  hieght?: string;
}) {
  const safeRows = rows ?? [];
  const safeColumns = columns ?? [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };
  return (
    <Paper className="!bg-transparent !shadow-2xl" sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer className={`${hieght ? hieght : "!h-[58dvh]"}`}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {safeColumns.map((column, i) => (
                <TableCell
                  className="!bg-lightgreen !text-nowrap !text-white !font-bold !text-center "
                  key={i}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontFamily: "cairo" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className="!bg-transparent">
            {safeRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
              return (
                <TableRow
                  hover
                  className="hover:bg-hovergreen! !bg-transparent"
                  onClick={() => (onRowClick ? onRowClick(row) : "")}
                  role="checkbox"
                  tabIndex={-1}
                  key={i}
                >
                  {safeColumns.map((column, i) => {
                    const value = getNestedValue(row, column.id);
                    const content = column.render
                      ? column.render(row)
                      : column.format && typeof value === "number"
                      ? column.format(value)
                      : value;
                    return (
                      <TableCell
                        className="!text-center !text-white !bg-[#115b77]"
                        key={i}
                        align={column.align}
                      >
                        {content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className={`!text-white !bg-[#115b77]`}
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={safeRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
