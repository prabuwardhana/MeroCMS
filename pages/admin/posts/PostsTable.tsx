import React, { useMemo } from "react";
import { navigate } from "vike/client/router";

import { useGetPostsQuery } from "@/hooks/api/useGetPostsQuery";
import { PostType } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { getPostsColumns } from "./postsColumnDef";
import { useDeletePostMutation } from "@/hooks/api/useDeletePostMutation";

const PostsTable = () => {
  const { postsQuery } = useGetPostsQuery();
  const deleteMutation = useDeletePostMutation();

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
        <DataTable data={postsQuery.data} columns={columns} />
      </CardContent>
    </Card>
  );
};

export default PostsTable;
