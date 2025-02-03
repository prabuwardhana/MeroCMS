import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CategoryType } from "@/lib/types";
import { DataTableColumnHeader, DataTableRowActions } from "@/components/DataTable";

interface CategoriesColumnsProps {
  onEdit: (category: CategoryType) => void;
  onDelete: (category: CategoryType) => void;
}

export const getBankAccountsColumns = ({ onEdit, onDelete }: CategoriesColumnsProps): ColumnDef<CategoryType>[] => [
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
