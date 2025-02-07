import { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import {Button} from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  onSortChange?: (columnId: string, direction: "asc" | "desc" | undefined) => void;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  //onSortChange,
}: DataTableColumnHeaderProps<TData, TValue>) {

  //console.log("column", column)
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }
  const handleSort = (direction: "asc" | "desc") => {
    const columnId = column.id;
    console.log("Sorting column:", columnId, "Direction:", direction);

    column.toggleSorting(direction === "desc");
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>

            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleSort("asc")}>
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("desc")}>
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {column.getCanHide() ? (
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
                Hide
              </DropdownMenuItem>
          ) : (
              <></>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
