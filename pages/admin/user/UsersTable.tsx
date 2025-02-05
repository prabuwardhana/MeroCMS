import React, { useMemo } from "react";
import { navigate } from "vike/client/router";

import { User } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { getUsersColumns } from "./usersColumnDef";
import { useGetUsersQuery } from "@/hooks/api/useGetUsersQuery";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useDeleteUserMutation } from "@/hooks/api/useDeleteUserMutation";

const UsersTable = () => {
  const { usersQuery } = useGetUsersQuery();
  const deleteMutation = useDeleteUserMutation();

  const filterOn = useMemo(
    () => [
      {
        column: "verified",
        title: "Status",
        options: [
          {
            value: "true",
            label: "Verified",
            icon: ShieldCheck,
          },
          {
            value: "false",
            label: "Not Verified",
            icon: ShieldAlert,
          },
        ],
      },
    ],
    [],
  );

  const onEdit = (user: User) => {
    navigate(`/admin/users/${user._id}/edit`);
  };

  const onDelete = (user: User) => {
    deleteMutation.mutate(user._id);
  };

  const columns = useMemo(() => getUsersColumns({ onEdit, onDelete }), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable data={usersQuery.data} columns={columns} type="users" filterOn={filterOn} />
      </CardContent>
    </Card>
  );
};

export default UsersTable;
