import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CategoryType, PostType } from "@/lib/types";
import { DataTableColumnHeader, DataTableRowActions } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";

interface CategoriesColumnsProps {
  onEdit: (category: PostType) => void;
  onDelete: (category: PostType) => void;
}

export const getPostsColumns = ({ onEdit, onDelete }: CategoriesColumnsProps): ColumnDef<PostType>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "author.profile.username",
    header: "Author",
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.categories.map((Item) => (Item as unknown as CategoryType).name).join(", "),
    header: "Categories",
    cell: (info) => {
      const values = (info.getValue() as string).split(",");
      return (
        <div className="flex flex-wrap gap-2">
          {values.map((value, idx) => (
            <Badge key={idx} variant="secondary">
              {value}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "published",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: (info) =>
      info.getValue() === true ? (
        <Badge className="bg-green-500">published</Badge>
      ) : (
        <Badge variant="destructive">draft</Badge>
      ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />,
    size: 50,
  },
];
