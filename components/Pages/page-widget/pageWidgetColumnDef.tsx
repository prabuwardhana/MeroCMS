import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { PageWidgetType } from "@/lib/types";
import { DataTableColumnHeader, DataTableRowActions } from "@/components/DataTable";
import { Checkbox } from "@/components/ui/checkbox";

interface PageWidgetColumnsProps {
  onEdit: (pageWidget: PageWidgetType) => void;
  onDelete: (pageWidget: PageWidgetType) => void;
}

export const getPageWidgetColumns = ({ onEdit, onDelete }: PageWidgetColumnsProps): ColumnDef<PageWidgetType>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Widget Name" />,
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />,
    size: 50,
  },
];
