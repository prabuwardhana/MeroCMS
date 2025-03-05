import * as React from "react";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import type { FilterOnType, TableType } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  type: TableType;
  filterOn?: FilterOnType[];
}

export function DataTableToolbar<TData>({ table, type, filterOn }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const searchableColumn =
    {
      posts: "title",
      comments: "content",
      categories: "name",
      users: "name",
      pages: "",
      portfolios: "",
      products: "",
      navmenu: "title",
      "page widgets": "title",
    }[type] || "none";

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Search ${type}...`}
          value={(table.getColumn(searchableColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn(searchableColumn)?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filterOn?.map((item) => {
          return (
            table.getColumn(item.column) && (
              <DataTableFacetedFilter
                key={item.column}
                column={table.getColumn(item.column)}
                title={item.title}
                options={item.options}
              />
            )
          );
        })}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}
