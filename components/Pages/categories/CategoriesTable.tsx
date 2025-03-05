import React, { useMemo, useState } from "react";
import { withFallback } from "vike-react-query";
import { CirclePlus, RotateCcw } from "lucide-react";

import type { CategoryType } from "@/src/lib/types";
import { useCategories } from "@/src/hooks/api/useCategories";

import { DeleteConfirmationDialog } from "@/components/Dialogs";
import { SkeletonTable } from "@/components/Skeletons";
import { DataTable } from "@/components/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getCategoriesColumns } from "./categoriesColumnDef";
import { CreateOrEditCategory } from "./CreateOrEditCategory";

export const CategoriesTable = withFallback(
  () => {
    const [categoryId, setCategoryId] = useState<string>();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { categoriesQuery, deleteMutation } = useCategories();

    const onEdit = (category: CategoryType) => {
      setCategoryId(category._id as string);
      setIsEditOpen(true);
    };

    const onDelete = (category: CategoryType) => {
      setCategoryId(category._id as string);
      setIsDeleteOpen(true);
    };

    const columns = useMemo(() => getCategoriesColumns({ onEdit, onDelete }), []);

    return (
      <>
        <DeleteConfirmationDialog
          title="Delete Category"
          description="Are you sure you want to delete this category?"
          objectId={categoryId as string}
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          mutate={deleteMutation.mutate}
        />
        <CreateOrEditCategory isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />
        <CreateOrEditCategory categoryId={categoryId} isOpen={isEditOpen} setIsOpen={setIsEditOpen} />
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-4">
              <div className="flex items-center">Categories</div>
              <Button variant="ghost" onClick={() => setIsCreateOpen(true)}>
                <CirclePlus />
                Create New Category
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={categoriesQuery.data} columns={columns} type="categories" />
          </CardContent>
        </Card>
      </>
    );
  },
  () => <SkeletonTable />,
  ({ retry, error }) => (
    <div>
      <div>Failed to load Categories: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </div>
  ),
);
