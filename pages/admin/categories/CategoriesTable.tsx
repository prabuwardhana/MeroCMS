import React, { useMemo } from "react";
import { navigate } from "vike/client/router";
import { withFallback } from "vike-react-query";

import { CategoryType } from "@/lib/types";

import { getCategoriesColumns } from "./categoriesColumnDef";

import { useDeleteCategoryMutation } from "@/hooks/api/useDeleteCategoryMutation";
import { useGetCategoriesQuery } from "@/hooks/api/useGetCategoriesQuery";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";

import { RotateCcw } from "lucide-react";

const CategoriesTable = withFallback(
  () => {
    const { categoriesQuery } = useGetCategoriesQuery();
    const deleteMutation = useDeleteCategoryMutation();

    const onEdit = (category: CategoryType) => {
      navigate(`/admin/categories/${category._id}/edit`);
    };

    const onDelete = (category: CategoryType) => {
      deleteMutation.mutate(category._id);
    };

    const columns = useMemo(() => getCategoriesColumns({ onEdit, onDelete }), []);

    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={categoriesQuery.data} columns={columns} type="categories" />
        </CardContent>
      </Card>
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

export default CategoriesTable;
