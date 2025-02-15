"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

// import { parents, departmentTypes } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import {axiosInstance} from "@/axios";
import { useEffect, useState, useCallback  } from 'react';

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    onTitleChange:(title: string) => void
    onFilterChange:(column: string, values: number[]) => void
}

export function DataTableToolbar<TData>({
  table,
  onTitleChange,
  onFilterChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const [parents, setParents] = useState([]);
  const [departmentTypes, setDepartmentTypes] = useState([]);
  
  const fetchDepartmentTypes = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/v1/department-type');
      setDepartmentTypes(response.data.data); // departmentTypes را ذخیره می‌کنیم
    } catch (error) {
      console.error("Failed to fetch department types:", error);
    }
  }, []); // حذف وابستگی departmentTypes
  
  const fetchParents = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/v1/department');
      setParents(response.data.data); // parents را ذخیره می‌کنیم
    } catch (error) {
      console.error("Failed to fetch parents:", error);
    }
  }, []); // حذف وابستگی parents
  
  useEffect(() => {
    fetchDepartmentTypes();
  }, [fetchDepartmentTypes]); // فقط از fetchDepartmentTypes به عنوان وابستگی استفاده کنید
  
  useEffect(() => {
    fetchParents();
  }, [fetchParents]); // فقط از fetchParents به عنوان وابستگی استفاده کنید
  

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
            onFilterChange={onFilterChange}
            options={departmentTypes}
          />
        )}
        {table.getColumn("parent") && (
          <DataTableFacetedFilter
            column={table.getColumn("parent")}
            title="parent"
            onFilterChange={onFilterChange}
            options={parents}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            // onClick={() => table.resetColumnFilters()}
            onClick={() => {
              table.resetColumnFilters();
              onFilterChange("departmentType",[]); // ریست کردن departmentTypes
              onFilterChange("parent",[]); // ریست کردن parentIds
            }}
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
