"use client";
import { useAppSelector } from "@/app/utils/store/hooks";
import { analyticsState } from "@/app/utils/store/slices/analytics-slice";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import SearchInput from "../common/searchInput/search-input";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BsFileEarmarkExcelFill } from "react-icons/bs";
import { FaFilePdf } from "react-icons/fa";

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
  const { offSetTop } = useAppSelector(analyticsState);
  const handleExportExcel = () => {
    const exportData = safeRows.map((row) => {
      const formattedRow: any = {};
      safeColumns.forEach((col) => {
        formattedRow[col.label] = getNestedValue(row, col.id);
      });
      return formattedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `exported-data-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("تقرير البيانات", 40, 40);

    const tableColumn = safeColumns.map((col) => col.label);
    const tableRows = safeRows.map((row) =>
      safeColumns.map((col) => {
        const value = getNestedValue(row, col.id);
        return value === null || value === undefined ? "" : String(value);
      })
    );

    autoTable(doc, {
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      styles: {
        font: "helvetica",
        fontSize: 10,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [17, 91, 119],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save(`exported-data-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <>
      <div className="text-lightgreen w-full flex items-center justify-between">
        <SearchInput />
      </div>
      <Paper
        className="!bg-transparent mt-1 !shadow-2xl"
        sx={{ width: "100%", overflow: "hidden" }}
      >
        <TableContainer
          className={hieght ? hieght : ""}
          sx={
            !hieght
              ? {
                  height: `calc(100dvh - ${offSetTop + 106}px - 50px)`,
                }
              : undefined
          }
        >
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
              {safeRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
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
        <div className="flex items-center justify-between px-3 py-1 !bg-[#115b77]">
          {!hieght && (
            <div className="gap-2 flex">
              <Button
                className="flex items-center gap-2"
                variant="contained"
                onClick={handleExportExcel}
                sx={{ fontFamily: "cairo" }}
              >
                Excel
                <BsFileEarmarkExcelFill />
              </Button>
              <Button
                className="flex items-center gap-2"
                variant="contained"
                onClick={handleExportPDF}
                sx={{ fontFamily: "cairo" }}
              >
                PDF
                <FaFilePdf />
              </Button>
            </div>
          )}
          <TablePagination
            className={`!text-white`}
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={safeRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Paper>
    </>
  );
}
