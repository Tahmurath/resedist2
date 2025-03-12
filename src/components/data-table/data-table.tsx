import {
  ColumnDef,
  flexRender,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx"


import { DataTablePagination } from "./data-table-pagination.tsx"
import { useReactTable, } from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  table: ReturnType<typeof useReactTable<TData>>;
  columns: ColumnDef<TData, TValue>[]
}

export function DataTable<TData, TValue>({
  table,
  columns,
  totalPages,
  totalRows,
  currentPage,
  rowsPerPage,
  onRowsPerPage,
  onPageChange,

}: DataTableProps<TData, TValue> & {
  totalPages: number;
  totalRows: number;
  currentPage: number;
  rowsPerPage: number;
  onRowsPerPage: (page: number) => void;
  onPageChange: (page: number) => void;
}) {


  return (
    <>
        <div className="rounded-xl border-t border-b bg-card border-gray-300">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                          </TableHead>
                      )
                    })}
                  </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                      <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                              )}
                            </TableCell>
                        ))}
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-4">
          <DataTablePagination
              table={table}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalPages={totalPages}
              totalRows={totalRows}
              onPageChange={onPageChange}
              onRowsPerPage={onRowsPerPage}
          />
        </div>
    </>


  )
}
