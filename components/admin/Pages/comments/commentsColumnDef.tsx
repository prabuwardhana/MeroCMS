import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { CommentType } from "@/lib/types";
import { dateStringOptions } from "@/constants/dateTimeOptions";
import { DataTableColumnHeader, DataTableRowActions } from "@/components/admin/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface CommentColumnsProps {
  onEdit: (comment: CommentType) => void;
  onDelete: (comment: CommentType) => void;
  onReply: (comment: CommentType) => void;
  onApprove: (comment: CommentType) => void;
}

export const getCommentsColumns = ({
  onEdit,
  onDelete,
  onReply,
  onApprove,
}: CommentColumnsProps): ColumnDef<CommentType>[] => [
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
    accessorKey: "author.profile.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Author" />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "content",
    header: "Comment",
    cell: (info) => <div dangerouslySetInnerHTML={{ __html: info.getValue() as string }}></div>,
  },
  {
    accessorKey: "post.title",
    header: "In response to",
    cell: (info) => info.getValue(),
  },
  {
    id: "approved",
    accessorFn: (d) => d.approved.toString(),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: (info) =>
      info.getValue() === "true" ? (
        <Badge className="bg-green-500 py-1 hover:bg-green-400">
          <ShieldCheck size={16} className="mr-2" />
          Approved
        </Badge>
      ) : (
        <Badge variant="destructive" className="py-1">
          <ShieldAlert size={16} className="mr-2" />
          Pending
        </Badge>
      ),
    filterFn: (row, id, value) => {
      const rowValue = (row.getValue(id) as string).split(", ");
      const isIntersect = value.filter((item: string) => rowValue.includes(item)).length > 0;
      return isIntersect;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Submitted On" />,
    cell: (info) => {
      const date = new Date(info.getValue() as Date);
      return date.toLocaleDateString("en-US", dateStringOptions);
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <DataTableRowActions row={row} onApprove={onApprove} onReply={onReply} onEdit={onEdit} onDelete={onDelete} />
    ),
    size: 50,
  },
];
