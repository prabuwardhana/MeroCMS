import React, { useMemo } from "react";
import { navigate } from "vike/client/router";

import { useGetPostsQuery } from "@/hooks/api/useGetPostsQuery";
import { PostType } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { getPostsColumns } from "./postsColumnDef";
import { useDeletePostMutation } from "@/hooks/api/useDeletePostMutation";
import { BookPlus, PencilLine } from "lucide-react";
import { useGetCategoriesQuery } from "@/hooks/api/useGetCategoriesQuery";

const PostsTable = () => {
  const { categoriesQuery } = useGetCategoriesQuery();
  const { postsQuery } = useGetPostsQuery();
  const deleteMutation = useDeletePostMutation();

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
};

export default PostsTable;
