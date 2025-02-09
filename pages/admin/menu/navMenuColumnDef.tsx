import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { NavMenuType } from "@/lib/types";
import { DataTableColumnHeader, DataTableRowActions } from "@/components/DataTable";
import { Checkbox } from "@/components/ui/checkbox";

interface NavMenuColumnsProps {
  onEdit: (navMenu: NavMenuType) => void;
  onDelete: (navMenu: NavMenuType) => void;
}

export const getNavMenusColumns = ({ onEdit, onDelete }: NavMenuColumnsProps): ColumnDef<NavMenuType>[] => [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nav Menu Title" />,
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />,
    size: 50,
  },
];
