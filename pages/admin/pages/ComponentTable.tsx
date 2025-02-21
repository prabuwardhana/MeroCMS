import React, { useMemo, useState } from "react";
import { Types } from "mongoose";
import { withFallback } from "vike-react-query";

import { PageComponentType } from "@/lib/types";
import { usePageComponents } from "@/hooks/api/usePageComponents";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";

import CreateOrEditComponent from "./CreateOrEditComponent";
import { getComponentColumns } from "./componentColumnDef";

import { CirclePlus, RotateCcw } from "lucide-react";

const ComponentTable = withFallback(
  () => {
    const [componentId, setComponentId] = useState<Types.ObjectId | null>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { componentsQuery, deleteMutation } = usePageComponents();

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
