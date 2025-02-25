import React, { useMemo, useState } from "react";
import { withFallback } from "vike-react-query";

import type { PageComponentType } from "@/lib/types";
import { usePageComponents } from "@/hooks/api/usePageComponents";

import { DataTable } from "@/components/admin/DataTable";
import { SkeletonTable } from "@/components/admin/Skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { CreateOrEditComponent } from "./CreateOrEditComponent";
import { getComponentColumns } from "./componentColumnDef";

import { CirclePlus, RotateCcw } from "lucide-react";

export const ComponentTable = withFallback(
  () => {
    const [componentId, setComponentId] = useState<string>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { componentsQuery, deleteMutation } = usePageComponents();

    const onEdit = (component: PageComponentType) => {
      setComponentId(component._id as string);
      setIsEditOpen(true);
    };

    const onDelete = (component: PageComponentType) => {
      deleteMutation.mutate(component._id);
    };

    const columns = useMemo(() => getComponentColumns({ onEdit, onDelete }), []);

    return (
      <>
        <CreateOrEditComponent isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
        <CreateOrEditComponent componentId={componentId} isOpen={isEditOpen} setIsOpen={setIsEditOpen} />
        <Card className="max-w-screen-md">
          <CardHeader>
            <CardTitle className="flex gap-4">
              <div className="flex items-center">Page Components</div>
              <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
                <CirclePlus />
                Create New Component
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={componentsQuery.data} columns={columns} type="components" />
          </CardContent>
        </Card>
      </>
    );
  },
  () => <SkeletonTable className="max-w-screen-md" />,
  ({ retry, error }) => (
    <div>
      <div>Failed to load Components: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </div>
  ),
);
