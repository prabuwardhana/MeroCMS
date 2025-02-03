import React from "react";
import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit: (value: TData) => void;
  onDelete: (value: TData) => void;
}

export const DataTableRowActions = <TData,>({ row, onEdit, onDelete }: DataTableRowActionsProps<TData>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(row.original)} className="cursor-pointer">
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-destructive cursor-pointer">
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
