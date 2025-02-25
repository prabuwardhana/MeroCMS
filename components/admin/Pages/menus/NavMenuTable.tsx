import React, { useMemo } from "react";
import { navigate } from "vike/client/router";
import { withFallback } from "vike-react-query";

import type { NavMenuType } from "@/lib/types";
import { useNavMenus } from "@/hooks/api/useNavMenus";

import { SkeletonTable } from "@/components/admin/Skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";

import { getNavMenusColumns } from "./navMenuColumnDef";

import { RotateCcw } from "lucide-react";

export const NavMenusTable = withFallback(
  () => {
    const { navMenusQuery, deleteMutation } = useNavMenus();

    const onEdit = (navMenu: NavMenuType) => {
      navigate(`/admin/nav-menu/${navMenu._id}/edit`);
    };

    const onDelete = (navMenu: NavMenuType) => {
      deleteMutation.mutate(navMenu._id);
    };

    const columns = useMemo(() => getNavMenusColumns({ onEdit, onDelete }), []);

    return (
      <Card className="max-w-screen-md">
        <CardHeader>
          <CardTitle>Navigation Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={navMenusQuery.data} columns={columns} type="navmenu" />
        </CardContent>
      </Card>
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
