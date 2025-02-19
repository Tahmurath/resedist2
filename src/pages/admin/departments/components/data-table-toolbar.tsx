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
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

  const isFiltered = table.getState().columnFilters.length > 0

  const [parents, setParents] = useState([]);
  const [departmentTypes, setDepartmentTypes] = useState([]);
  // const [searchQuerydep, setSearchQuerydep] = useState("");
  // const [searchQuerypar, setSearchQuerypar] = useState("");
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>({
    departmentTypes: "",
    parents: "",
  });

  
  const fetchFilteredOptions = async (query: string, type: "departmentTypes" | "parents") => {
    // if (query.length < 2) return; // جلوگیری از درخواست‌های غیرضروری
  
    const endpoint = type === "departmentTypes"
    ? `/api/v1/department-type?title=${query}`
    : `/api/v1/department?title=${query}`;


    try {
      const response = await axiosInstance.get(endpoint);
      if (type === "departmentTypes") {
        setDepartmentTypes(response.data.data);
      } else if(type === "parents") {
        setParents(response.data.data);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  
  };
  
  useEffect(() => {
    fetchFilteredOptions(searchQueries.departmentTypes, "departmentTypes");
  }, [searchQueries.departmentTypes]);

  useEffect(() => {
    fetchFilteredOptions(searchQueries.parents, "parents");
  }, [searchQueries.parents]);
  

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
            // key={departmentTypes.length}
            column={table.getColumn("departmentType")}
            title={t("site.deptype")}
            onFilterChange={onFilterChange}
            options={departmentTypes}
            setSearchQuery={(query) =>
              setSearchQueries((prev) => ({ ...prev, departmentTypes: query }))
            }      
          />
        )}
        {table.getColumn("parent") && (
          <DataTableFacetedFilter
            // key={parent.length}
            column={table.getColumn("parent")}
            title={t("site.parent")}
            onFilterChange={onFilterChange}
            options={parents}
            setSearchQuery={(query) =>
              setSearchQueries((prev) => ({ ...prev, parents: query }))
            }      
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
