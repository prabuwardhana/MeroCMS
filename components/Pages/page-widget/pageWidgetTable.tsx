import React, { useMemo, useState } from "react";
import { withFallback } from "vike-react-query";
import { CirclePlus, RotateCcw } from "lucide-react";

import { usePageWidgets } from "@/src/hooks/api/usePageComponents";
import type { PageWidgetType } from "@/src/lib/types";

import { DeleteConfirmationDialog } from "@/components/Dialogs";
import { SkeletonTable } from "@/components/Skeletons";
import { DataTable } from "@/components/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { CreateOrEditPageWidget } from "./CreateOrEditPageWidget";
import { getPageWidgetColumns } from "./pageWidgetColumnDef";

export const PageWidgetTable = withFallback(
  () => {
    const [pageWidgetId, setPageWidgetId] = useState<string | null>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { pageWidgetsQuery, deleteMutation } = usePageWidgets();

    const onEdit = (pagewidget: PageWidgetType) => {
      setPageWidgetId(pagewidget._id);
      setIsEditOpen(true);
    };

    const onDelete = (pageWidget: PageWidgetType) => {
      setPageWidgetId(pageWidget._id);
      setIsDeleteOpen(true);
    };

    const columns = useMemo(() => getPageWidgetColumns({ onEdit, onDelete }), []);

    return (
      <>
        <DeleteConfirmationDialog
          title="Delete Page Widget"
          description="Are you sure you want to delete this page widget?"
          objectId={pageWidgetId as string}
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          mutate={deleteMutation.mutate}
        />
        <CreateOrEditPageWidget isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
        <CreateOrEditPageWidget pageWidgetId={pageWidgetId as string} isOpen={isEditOpen} setIsOpen={setIsEditOpen} />
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
