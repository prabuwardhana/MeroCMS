import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { PageType } from "@/lib/types";
import { DataTableColumnHeader, DataTableRowActions } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BookPlus, PencilLine } from "lucide-react";

interface pagesColumnsProps {
  onEdit: (category: PageType) => void;
  onDelete: (category: PageType) => void;
}

export const getPagesColumns = ({ onEdit, onDelete }: pagesColumnsProps): ColumnDef<PageType>[] => [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "author.profile.username",
    header: "Author",
    cell: (info) => info.getValue(),
  },
  {
    id: "published",
    accessorFn: (d) => d.published.toString(),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: (info) =>
      info.getValue() === "true" ? (
        <Badge className="bg-green-500 py-1 hover:bg-green-400">
          <BookPlus size={16} className="mr-2" />
          published
        </Badge>
      ) : (
        <Badge variant="destructive" className="py-1">
          <PencilLine size={16} className="mr-2" />
          draft
        </Badge>
      ),
    filterFn: (row, id, value) => {
      const rowValue = (row.getValue(id) as string).split(", ");
      const isIntersect = value.filter((item: string) => rowValue.includes(item)).length > 0;
      return isIntersect;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />,
    size: 50,
  },
];
