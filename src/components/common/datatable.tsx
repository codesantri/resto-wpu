import { ReactNode } from "react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { LIMIT_LISTS } from "@/tables/pagination-table";
import PaginationDatatable from "./pagination-datatable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

type DataTableProps = {
  header?: string[];
  data?: (string | ReactNode)[][];
  isLoading?: boolean;
  totalPages:number;
  currentPage:number;
  currentLimit:number;
  onChangePage:(page:number)=>void;
  onChangeLimit:(limit:number)=>void;
};

export default function DataTable(
  {
    isLoading = false, 
    header = [],
    data = [],
    totalPages,
    currentPage,
    currentLimit,
    onChangePage,
    onChangeLimit,
  }: DataTableProps) {
  const showEmpty = !isLoading && data.length === 0;

  return (
    <div className="w-full flex flex-col gap-4">
      <Card className="p-0">
        <Table className="w-full rounded-sm overflow-hidden">
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              {header.map((col, index) => (
                <TableHead
                  key={`th-${col}`}
                  className={`px-4 py-2 ${index === 0 ? "w-[1px]" : ""} ${
                    index === header.length - 1 ? "text-right" : ""
                  }`}
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : showEmpty ? (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  No Result Data
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
               <TableRow key={`tr-${rowIndex}`} className="align-middle">
                  {row.map((item, cellIndex) => (
                    <TableCell
                      key={`tc-${rowIndex}-${cellIndex}`}
                      className={`px-4 py-2 align-middle ${
                        cellIndex === 0 ? "w-[1px]" : ""
                      } ${cellIndex === row.length - 1 ? "text-right" : ""}`}
                    >
                      {cellIndex === row.length - 1 ? (
                        <div className="flex justify-end items-center">
                          {item}
                        </div>
                      ) : (
                        item
                      )}
                    </TableCell>
                  ))}
                </TableRow>

              ))
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>Show</Label>
          <Select value={currentLimit.toString()} onValueChange={(value)=>onChangeLimit(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  {LIMIT_LISTS.map((limit) => (
                    <SelectItem key={limit} value={limit.toString()}>
                      {limit}
                    </SelectItem>
                  ))}
                </SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label>Entries</Label>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-end">
            <PaginationDatatable
              currentPage={currentPage}
              onChangePage={onChangePage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
      
    </div>
  );
}
