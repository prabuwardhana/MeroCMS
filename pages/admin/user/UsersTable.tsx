import React, { useMemo } from "react";
import { navigate } from "vike/client/router";
import { withFallback } from "vike-react-query";

import { User } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";

import { getUsersColumns } from "./usersColumnDef";

import { useDeleteUserMutation } from "@/hooks/api/useDeleteUserMutation";
import { useGetUsersQuery } from "@/hooks/api/useGetUsersQuery";

import { RotateCcw, ShieldAlert, ShieldCheck } from "lucide-react";

const UsersTable = withFallback(
  () => {
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
  },
  () => <div>Loading Users...</div>,
  ({ retry, error }) => (
    <div>
      <div>Failed to load Users: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </div>
  ),
);

export default UsersTable;
