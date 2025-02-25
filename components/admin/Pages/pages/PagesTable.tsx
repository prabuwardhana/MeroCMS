import React, { useMemo } from "react";
import { navigate } from "vike/client/router";
import { withFallback } from "vike-react-query";

import { usePages } from "@/hooks/api/usePages";
import type { PageType } from "@/lib/types";

import { DataTable } from "@/components/admin/DataTable";
import { SkeletonTable } from "@/components/admin/Skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getPagesColumns } from "./pagesColumnDef";

import { BookPlus, PencilLine, RotateCcw } from "lucide-react";

export const PagesTable = withFallback(
  () => {
    const { pagesQuery, deleteMutation } = usePages();

    const filterOn = useMemo(
      () => [
        {
          column: "published",
          title: "Status",
          options: [
            {
              value: "true",
              label: "Published",
              icon: BookPlus,
            },
            {
              value: "false",
              label: "Draft",
              icon: PencilLine,
            },
          ],
        },
      ],
      [],
    );

    const onEdit = (Page: PageType) => {
      navigate(`/admin/pages/${Page._id}/edit`);
    };

    const onDelete = (Page: PageType) => {
      deleteMutation.mutate(Page._id);
    };

    const columns = useMemo(() => getPagesColumns({ onEdit, onDelete }), []);

    return (
      <Card>
        <CardHeader>
          <CardTitle>Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={pagesQuery.data} columns={columns} type="posts" filterOn={filterOn} />
        </CardContent>
      </Card>
    );
  },
  () => <SkeletonTable />,
  ({ retry, error }) => (
    <div>
      <div>Failed to load Posts: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </div>
  ),
);
