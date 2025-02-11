import React, { useMemo, useState } from "react";
import { withFallback } from "vike-react-query";

import { PageComponentType } from "@/lib/types";

import { useDeleteComponentMutation } from "@/hooks/api/useDeleteComponentMutation";
import { useGetComponentQuery } from "@/hooks/api/useGetComponentsQuery";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";

import { CirclePlus, RotateCcw } from "lucide-react";
import { getComponentColumns } from "./componentColumnDef";
import CreateOrEditComponent from "./CreateOrEditComponent";
import { Types } from "mongoose";

const ComponentTable = withFallback(
  () => {
    const [componentId, setComponentId] = useState<Types.ObjectId | null>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { componentsQuery } = useGetComponentQuery();
    const deleteMutation = useDeleteComponentMutation();

    const onEdit = (component: PageComponentType) => {
      setComponentId(component._id);
      setIsEditOpen(true);
    };

    const onDelete = (component: PageComponentType) => {
      deleteMutation.mutate(component._id);
    };

    const columns = useMemo(() => getComponentColumns({ onEdit, onDelete }), []);

    return (
      <>
        <CreateOrEditComponent isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
        <CreateOrEditComponent componentId={componentId?.toString()} isOpen={isEditOpen} setIsOpen={setIsEditOpen} />
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
  () => <div>Loading Components...</div>,
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

export default ComponentTable;
