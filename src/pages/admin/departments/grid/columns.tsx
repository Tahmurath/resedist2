"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

import { Department } from "./schema.ts"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header.tsx"
import { DataTableRowActions } from "./data-table-row-actions"
import { useTranslation } from "react-i18next";

// const { t } = useTranslation();

export const GetColumns = (
    handleEditDialog: (id: number) => void,
    handleRemoveDialog: (id: number) => void
):ColumnDef<Department>[]=>{


  const { t } = useTranslation();

  const columns: ColumnDef<Department>[] = [
    {
      id: "select",
      header: ({ table }) => (
          <Checkbox
              checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
              className="translate-y-[2px]"
          />
      ),
      cell: ({ row }) => (
          <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="translate-y-[2px]"
          />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("department.department")} />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
      //enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("site.title")} />
      ),
      cell: ({ row }) => {

        return (
            <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
            </div>
        )
      },
    },
    {
      accessorKey: "departmentType",
      header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("department.deptype")} />
      ),
      cell: ({ row }) => {

        return (
            <div className="flex space-x-2">

          <span className="max-w-[500px] truncate font-medium">

            {(row.getValue("departmentType") as { title?: string } | null)?.title ?? "-"}
          </span>
            </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "parent",
      header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("department.parent")}  />
      ),
      cell: ({ row }) => {


        return (
            <div className="flex space-x-2">

          <span className="max-w-[500px] truncate font-medium">
            {(row.getValue("parent") as { title?: string } | null)?.title ?? "-"}

          </span>
            </div>
        )
      },
      enableSorting: false,
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} handleEditDialog={handleEditDialog} handleRemoveDialog={handleRemoveDialog} />,
    },
  ]
  return columns
}


