import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { User } from "@/core/lib/types";
import { DataTableColumnHeader, DataTableRowActions } from "@/components/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface CategoriesColumnsProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const getUsersColumns = ({ onEdit, onDelete }: CategoriesColumnsProps): ColumnDef<User>[] => [
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
    id: "username",
    accessorKey: "profile.username",
    header: "Username",
    cell: (info) => info.getValue(),
  },
  {
    id: "name",
    accessorKey: "profile.name",
    header: "Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) => info.getValue(),
  },
  {
    id: "verified",
    accessorFn: (d) => d.verified.toString(),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: (info) =>
      info.getValue() === "true" ? (
        <Badge className="bg-green-500 py-1 hover:bg-green-400">
          <ShieldCheck size={16} className="mr-2" />
          Verified
        </Badge>
      ) : (
        <Badge variant="destructive" className="py-1">
          <ShieldAlert size={16} className="mr-2" />
          Not Verified
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
