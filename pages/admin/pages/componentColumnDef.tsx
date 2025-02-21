import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { PageComponentType } from "@/lib/types";
import { DataTableColumnHeader, DataTableRowActions } from "@/components/admin/DataTable";
import { Checkbox } from "@/components/ui/checkbox";

interface ComponentColumnsProps {
  onEdit: (category: PageComponentType) => void;
  onDelete: (category: PageComponentType) => void;
}

export const getComponentColumns = ({ onEdit, onDelete }: ComponentColumnsProps): ColumnDef<PageComponentType>[] => [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Component Name" />,
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />,
    size: 50,
  },
];
