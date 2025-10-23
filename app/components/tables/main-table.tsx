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
}: {
  columns: any[];
  rows: any[];
  onRowClick?: (data: any) => void;
}) {
  const safeRows = rows ?? [];
  const safeColumns = columns ?? [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 360 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {safeColumns.map((column, i) => (
                <TableCell
                  className="!bg-xlightgreen !text-nowrap !text-center"
                  key={i}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {safeRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
              return (
                <TableRow
                  hover
                  className="hover:bg-xlightgreen!"
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
                      <TableCell className="!text-center" key={i} align={column.align}>
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
        rowsPerPageOptions={[10, 25, 100]}
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
