"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

import { Department } from "./schema.ts"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header.tsx"
import { DataTableRowActions } from "./data-table-row-actions"

// const { t } = useTranslation();

export const columns: ColumnDef<Department>[] = [
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
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    //enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
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
      <DataTableColumnHeader column={column} title="departmentType" />
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
      <DataTableColumnHeader column={column} title="parent" />
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
  // {
  //   accessorKey: "departmentType",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="departmentType" />
  //   ),
  //   cell: ({ row }) => {
  //     const departmentType = departmentTypes.find(
  //       (departmentType) => departmentType.value === row.getValue("departmentType")
  //     )
  //
  //     if (!departmentType) {
  //       return null
  //     }
  //
  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {departmentType.icon && (
  //           <departmentType.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{row.getValue("departmentType")?.title}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  // {
  //   accessorKey: "parent",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="parent" />
  //   ),
  //   cell: ({ row }) => {
  //     const parent = parents.find(
  //       (parent) => parent.value === row.getValue("parent")
  //     )
  //
  //     if (!parent) {
  //       return null
  //     }
  //
  //     return (
  //       <div className="flex items-center">
  //         {parent.icon && (
  //           <parent.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{parent.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
