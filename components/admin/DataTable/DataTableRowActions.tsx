import React from "react";
import { Row } from "@tanstack/react-table";
import type { CommentType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageCirclePlus, MessageCircleX, MoreHorizontal, Pencil, Reply, Trash2 } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit: (value: TData) => void;
  onDelete: (value: TData) => void;
  onReply?: (value: TData) => void;
  onApprove?: (value: TData) => void;
}

export const DataTableRowActions = <TData,>({
  row,
  onEdit,
  onDelete,
  onReply,
  onApprove,
}: DataTableRowActionsProps<TData>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onApprove && (
          <>
            <DropdownMenuItem onClick={() => onApprove(row.original)} className="cursor-pointer">
              {(row.original as CommentType).approved ? <MessageCircleX /> : <MessageCirclePlus />}
              {(row.original as CommentType).approved ? "Unapprove" : "Approve"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {onReply && (
          <>
            <DropdownMenuItem onClick={() => onReply(row.original)} className="cursor-pointer">
              <Reply />
              Reply
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
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
