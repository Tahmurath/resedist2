import * as React from "react"
import {Column} from "@tanstack/react-table"
import { Check, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils.ts"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command.tsx"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { useState  } from 'react';

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    title: string
    id: any
    icon?: React.ComponentType<{ className?: string }>
  }[]
  onFilterChange:(column: string | undefined, values: number[]) => void
  setSearchQuery: (query: string) => void;
}


export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  onFilterChange,
  setSearchQuery,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  const [selectedLabels, setSelectedLabels] = useState<{ [key: string]: string }>({});

  options = options || []; 


  const handleSelectionChange = (value: string) => {


    const option = options.find((opt) => opt.id === value);

    if(selectedValues.size <=0){
      setSelectedLabels(() => ({}))
    }

    if (selectedValues.has(value)) {
      selectedValues.delete(value)
      setSelectedLabels((prevLabels) => {
        const newLabels = { ...prevLabels };
        delete newLabels[value];
        return newLabels;
      });
    } else {
      selectedValues.add(value)
      if (option) {
        setSelectedLabels((prevLabels) => ({
          ...prevLabels,
          [value]: option.title,
        }));
      }
    }


    const filterValues = Array.from(selectedValues)
    column?.setFilterValue(filterValues.length ? filterValues : undefined)

  
    column ? (onFilterChange(column?.id, filterValues.map((str) => Number(str)))) : (
      console.info("onFilterChange error")
    )
    
  }


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {
                  selectedValues.size > 5 ? (
                      <Badge
                          variant="secondary"
                          className="rounded-sm px-1 font-normal"
                      >
                        {selectedValues.size} selected
                      </Badge>
                          ) : (
                  Object.entries(selectedLabels).map(([key, value]) => (
                  <Badge
                    variant="secondary"
                    key={key}
                  className="rounded-sm px-1 font-normal"
                  >
                    {value}
                  </Badge>
                  ))
                  )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
      <Command shouldFilter={false}>
          <CommandInput 
          placeholder={title} 
          onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.id)
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => handleSelectionChange(option.id)} // 🎯 استفاده از تابع اصلاح‌شده
                  >

                 
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.title} - {option.id}</span>
                    {facets?.get(option.id) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.id)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                <CommandItem
                    onSelect={() => {
                      column?.setFilterValue(undefined)
                      onFilterChange(column?.id, [])
                      setSelectedLabels(() => ({}))
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
