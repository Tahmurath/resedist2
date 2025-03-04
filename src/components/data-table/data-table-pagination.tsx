import {Table} from "@tanstack/react-table"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

import {Button} from "@/components/ui/button.tsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    currentPage: number
    rowsPerPage: number
    totalPages: number
    totalRows: number
    onPageChange: (page: number) => void
    onRowsPerPage: (page: number) => void
}

export function DataTablePagination<TData>({
                                               table,
                                               currentPage,
                                               rowsPerPage,
                                               totalPages,
                                               totalRows,
                                               onPageChange,
                                               onRowsPerPage,
                                           }: DataTablePaginationProps<TData>) {


    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1)
    }

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1)
    }

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground hidden lg:flex">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {totalRows} row(s) selected.
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium">
                <p className="text-sm font-medium hidden lg:flex ">Rows per page </p>
                <Select
                    value={`${rowsPerPage}`}
                    onValueChange={(value) => {
                        onRowsPerPage(Number(value))
                        table.setPageSize(Number(value))
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={`${rowsPerPage}`}/>
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[5, 10, 15, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft/>
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft/>
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight/>
                </Button>
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight/>
                </Button>
            </div>
        </div>
    )
}
