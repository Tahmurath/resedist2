"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { parents, departmentTypes } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    onTitleChange:(title: string) => void
}

export function DataTableToolbar<TData>({
  table,
  onTitleChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Departments..."
          onChange={(event) => onTitleChange(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("departmentType") && (
          <DataTableFacetedFilter
            column={table.getColumn("departmentType")}
            title="departmentType"
            options={departmentTypes}
          />
        )}
        {table.getColumn("parent") && (
          <DataTableFacetedFilter
            column={table.getColumn("parent")}
            title="parent"
            options={parents}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
