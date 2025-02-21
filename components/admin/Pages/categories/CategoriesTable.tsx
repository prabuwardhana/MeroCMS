import React, { useMemo } from "react";
import { navigate } from "vike/client/router";
import { withFallback } from "vike-react-query";

import { CategoryType } from "@/lib/types";

import { useCategories } from "@/hooks/api/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";

import { getCategoriesColumns } from "./categoriesColumnDef";

import { RotateCcw } from "lucide-react";

export const CategoriesTable = withFallback(
  () => {
    const { categoriesQuery, deleteMutation } = useCategories();

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
