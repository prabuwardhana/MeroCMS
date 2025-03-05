import React, { useMemo, useState } from "react";
import { navigate } from "vike/client/router";
import { withFallback } from "vike-react-query";
import { RotateCcw, ShieldAlert, ShieldCheck } from "lucide-react";

import { useUsers } from "@/src/hooks/api/useUsers";
import type { User } from "@/src/lib/types";

import { DeleteConfirmationDialog } from "@/components/Dialogs";
import { SkeletonTable } from "@/components/Skeletons";
import { DataTable } from "@/components/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getUsersColumns } from "./usersColumnDef";

export const UsersTable = withFallback(
  () => {
    const [userId, setUserId] = useState<string | null>();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { usersQuery, deleteMutation } = useUsers();

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
      setUserId(user._id);
      setIsDeleteOpen(true);
    };

    const columns = useMemo(() => getUsersColumns({ onEdit, onDelete }), []);

    return (
      <>
        <DeleteConfirmationDialog
          title="Delete User"
          description="Are you sure you want to delete this user?"
          objectId={userId as string}
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          mutate={deleteMutation.mutate}
        />
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={usersQuery.data} columns={columns} type="users" filterOn={filterOn} />
          </CardContent>
        </Card>
      </>
    );
  },
  () => <SkeletonTable />,
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
