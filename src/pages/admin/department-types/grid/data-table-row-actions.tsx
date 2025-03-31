"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  // DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { departmentSchema } from "./schema.ts"
import { NavLink } from "react-router"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  handleEditDialog: (id: number) => void;
  handleRemoveDialog: (id: number) => void;
}

export function DataTableRowActions<TData>({
  row,
  handleEditDialog,
  handleRemoveDialog,
}: DataTableRowActionsProps<TData>) {
  const department = departmentSchema.parse(row.original);

  const edit = () => {
    handleEditDialog(department?.id);
  }

  const remove = () => {
    handleRemoveDialog(department?.id);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
      <DropdownMenuItem ><NavLink to={"/admin/department-types/"+department?.id}>View</NavLink></DropdownMenuItem>
        <DropdownMenuItem onClick={edit}>Edit</DropdownMenuItem>
        {/* onClick={() => alert(534534)} */}
        
        {/*<DropdownMenuItem>Make a copy</DropdownMenuItem>*/}
        {/*<DropdownMenuItem>Favorite</DropdownMenuItem>*/}
        {/*<DropdownMenuSeparator />*/}
        {/*<DropdownMenuSub>*/}
        {/*  <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>*/}
        {/*  <DropdownMenuSubContent>*/}
        {/*    <DropdownMenuRadioGroup >*/}

        {/*        <DropdownMenuItem >*/}
        {/*          {department.id}*/}
        {/*        </DropdownMenuItem>*/}
        {/*        <DropdownMenuItem >*/}
        {/*          Make a copy 2*/}
        {/*        </DropdownMenuItem>*/}

        {/*    </DropdownMenuRadioGroup>*/}
        {/*  </DropdownMenuSubContent>*/}
        {/*</DropdownMenuSub>*/}
        {/*<DropdownMenuSeparator />*/}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={remove}>
          Delete
          {/*<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>*/}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
