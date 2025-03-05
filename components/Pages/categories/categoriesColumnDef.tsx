import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { CategoryType } from "@/src/lib/types";
import { DataTableColumnHeader, DataTableRowActions } from "@/components/DataTable";
import { Checkbox } from "@/components/ui/checkbox";

interface CategoriesColumnsProps {
  onEdit: (category: CategoryType) => void;
  onDelete: (category: CategoryType) => void;
}

export const getCategoriesColumns = ({ onEdit, onDelete }: CategoriesColumnsProps): ColumnDef<CategoryType>[] => [
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
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category Name" />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />,
    size: 50,
  },
];
