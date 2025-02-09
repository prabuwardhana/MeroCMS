import React, { useMemo } from "react";
import { navigate } from "vike/client/router";
import { withFallback } from "vike-react-query";

import { NavMenuType } from "@/lib/types";

import { useGetNavMenusQuery } from "@/hooks/api/useGetNavMenusQuery";
import { useDeleteNavMenuMutation } from "@/hooks/api/useDeleteNavMenuMutation";
import { getNavMenusColumns } from "./navMenuColumnDef";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";

import { RotateCcw } from "lucide-react";

const NavMenusTable = withFallback(
  () => {
    const { navMenusQuery } = useGetNavMenusQuery();
    const deleteMutation = useDeleteNavMenuMutation();

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
  () => <div>Loading Nav Menus...</div>,
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

export default NavMenusTable;
