import React, { useMemo, useState } from "react";
import { withFallback } from "vike-react-query";

import type { PageWidgetType } from "@/lib/types";
import { usePageWidgets } from "@/hooks/api/usePageComponents";

import { DataTable } from "@/components/admin/DataTable";
import { SkeletonTable } from "@/components/admin/Skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { CreateOrEditPageWidget } from "./CreateOrEditPageWidget";
import { getPageWidgetColumns } from "./pageWidgetColumnDef";

import { CirclePlus, RotateCcw } from "lucide-react";

export const PageWidgetTable = withFallback(
  () => {
    const [pageWidgetId, setPageWidgetId] = useState<string>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { pageWidgetsQuery, deleteMutation } = usePageWidgets();

    const onEdit = (pagewidget: PageWidgetType) => {
      setPageWidgetId(pagewidget._id as string);
      setIsEditOpen(true);
    };

    const onDelete = (pageWidget: PageWidgetType) => {
      deleteMutation.mutate(pageWidget._id);
    };

    const columns = useMemo(() => getPageWidgetColumns({ onEdit, onDelete }), []);

    return (
      <>
        <CreateOrEditPageWidget isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
        <CreateOrEditPageWidget pageWidgetId={pageWidgetId} isOpen={isEditOpen} setIsOpen={setIsEditOpen} />
        <Card className="max-w-screen-md">
          <CardHeader>
            <CardTitle className="flex gap-4">
              <div className="flex items-center">Page Widgets</div>
              <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
                <CirclePlus />
                Create New Widget
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={pageWidgetsQuery.data} columns={columns} type="page widgets" />
          </CardContent>
        </Card>
      </>
    );
  },
  () => <SkeletonTable className="max-w-screen-md" />,
  ({ retry, error }) => (
    <div>
      <div>Failed to load Page Widgets: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </div>
  ),
);
