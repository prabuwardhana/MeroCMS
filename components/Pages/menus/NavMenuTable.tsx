import React, { useMemo, useState } from "react";
import { navigate } from "vike/client/router";
import { withFallback } from "vike-react-query";
import { RotateCcw } from "lucide-react";

import type { NavMenuType } from "@/src/lib/types";
import { useNavMenus } from "@/src/hooks/api/useNavMenus";

import { DeleteConfirmationDialog } from "@/components/Dialogs";
import { SkeletonTable } from "@/components/Skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";

import { getNavMenusColumns } from "./navMenuColumnDef";

export const NavMenusTable = withFallback(
  () => {
    const [navMenuId, setNavMenuId] = useState<string | null>();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { navMenusQuery, deleteMutation } = useNavMenus();

    const onEdit = (navMenu: NavMenuType) => {
      navigate(`/admin/nav-menu/${navMenu._id}/edit`);
    };

    const onDelete = (navMenu: NavMenuType) => {
      setNavMenuId(navMenu._id);
      setIsDeleteOpen(true);
    };

    const columns = useMemo(() => getNavMenusColumns({ onEdit, onDelete }), []);

    return (
      <>
        <DeleteConfirmationDialog
          title="Delete Nav Menu"
          description="Are you sure you want to delete this nav menu?"
          objectId={navMenuId as string}
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          mutate={deleteMutation.mutate}
        />
        <Card className="flex-grow max-w-screen-md">
          <CardHeader>
            <CardTitle>Navigation Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={navMenusQuery.data} columns={columns} type="navmenu" />
          </CardContent>
        </Card>
      </>
    );
  },
  () => <SkeletonTable className="max-w-screen-md" />,
  ({ retry, error }) => (
    <div>
      <div>Failed to load Nav Menus: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </div>
  ),
);
