import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options.tsx";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter.tsx";
import { axiosInstance } from "@/axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import useDebounce2 from "@/lib/debounce.ts";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onTitleChange: (title: string) => void;
  onFilterChange: (column: string | undefined, values: boolean) => void;
}




export function DataTableToolbar<TData>({
                                          table,
                                          onTitleChange,
                                          onFilterChange,
                                        }: DataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;

  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const filterData = (checked) => {
    setShowActiveOnly(checked);
    onFilterChange("is_active",checked)
  };



  return (
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
              placeholder={t("department.searchbytitle")}
              onChange={(event) => onTitleChange(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
          />
          <div className="hidden lg:flex">
        
          <div className="flex items-center space-x-2">
            <Label htmlFor="terms">Only Active types</Label>
            <Switch 
            id="ativated"
            //defaultValue={true}
            //onChange={(event) => onFilterChange("ativated",true)}
            checked={showActiveOnly}
            onCheckedChange={filterData}

            />
          </div>
             
            {isFiltered && (
                <Button
                    variant="ghost"
                    onClick={() => {
                      table.resetColumnFilters();
                    }}
                    className="h-8 px-2 lg:px-3"
                >
                  Reset
                  <X />
                </Button>
            )}
          </div>
        </div>
        <DataTableViewOptions table={table} />
      </div>
  );
}