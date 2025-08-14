import { ReactNode } from "react";
import { Card } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import PaginationDatatable from "./pagination-datatable";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { LIMIT_LISTS } from "@/tables/pagination-table";

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
                  className={`px-6 py-3 ${index === 0 ? "w-[100px]" : ""} ${
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
                <TableRow key={`tr-${rowIndex}`}>
                  {row.map((item, cellIndex) => (
                    <TableCell
                      key={`tc-${rowIndex}-${cellIndex}`}
                      className={`px-6 py-3 ${
                        cellIndex === 0 ? "w-[100px]" : ""
                      } ${cellIndex === row.length - 1 ? "text-right" : ""}`}
                    >
                      {item}
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
