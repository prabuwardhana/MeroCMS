import React, { useMemo } from "react";
import { navigate } from "vike/client/router";
import { withFallback } from "vike-react-query";

import { PostType } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";

import { getPostsColumns } from "./postsColumnDef";

import { usePosts } from "@/hooks/api/usePosts";
import { useCategories } from "@/hooks/api/useCategories";

import { BookPlus, PencilLine, RotateCcw } from "lucide-react";

const PostsTable = withFallback(
  () => {
    const { categoriesQuery } = useCategories();
    const { postsQuery, deleteMutation } = usePosts();

    const filterOn = useMemo(
      () => [
        {
          column: "categories",
          title: "Categories",
          options: categoriesQuery.data.map((data) => {
            return {
              value: data.name,
              label: data.name,
            };
          }),
        },
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

    const onEdit = (Post: PostType) => {
      navigate(`/admin/posts/${Post._id}/edit`);
    };

    const onDelete = (Post: PostType) => {
      deleteMutation.mutate(Post._id);
    };

    const columns = useMemo(() => getPostsColumns({ onEdit, onDelete }), []);

    return (
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={postsQuery.data} columns={columns} type="posts" filterOn={filterOn} />
        </CardContent>
      </Card>
    );
  },
  () => <div>Loading Posts...</div>,
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

export default PostsTable;
