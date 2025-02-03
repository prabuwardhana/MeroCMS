import React, { useMemo } from "react";
import { navigate } from "vike/client/router";

import { useDeleteCategoryMutation } from "@/hooks/api/useDeleteCategoryMutation";
import { useGetCategoriesQuery } from "@/hooks/api/useGetCategoriesQuery";
import { CategoryType } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { getBankAccountsColumns } from "./categoriesColumnDef";

const CategoriesTable = () => {
  const { categoriesQuery } = useGetCategoriesQuery();
  const deleteMutation = useDeleteCategoryMutation();

  const onEdit = (category: CategoryType) => {
    navigate(`/admin/categories/${category._id}/edit`);
  };

  const onDelete = (category: CategoryType) => {
    deleteMutation.mutate(category._id);
  };

  const columns = useMemo(() => getBankAccountsColumns({ onEdit, onDelete }), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable data={categoriesQuery.data} columns={columns} />
      </CardContent>
    </Card>
  );
};

export default CategoriesTable;
