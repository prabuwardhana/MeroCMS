import React, { useMemo, useState } from "react";
import { withFallback } from "vike-react-query";

import type { CategoryType } from "@/lib/types";

import { useCategories } from "@/hooks/api/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";

import { getCategoriesColumns } from "./categoriesColumnDef";

import { CirclePlus, RotateCcw } from "lucide-react";
import { CreateOrEditCategory } from "./CreateOrEditCategory";

export const CategoriesTable = withFallback(
  () => {
    const [categoryId, setCategoryId] = useState<string>();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { categoriesQuery, deleteMutation } = useCategories();

    const onEdit = (category: CategoryType) => {
      setCategoryId(category._id as string);
      setIsEditOpen(true);
    };

    const onDelete = (category: CategoryType) => {
      deleteMutation.mutate(category._id);
    };

    const columns = useMemo(() => getCategoriesColumns({ onEdit, onDelete }), []);

    return (
      <>
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
  () => <div>Loading Categories...</div>,
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
