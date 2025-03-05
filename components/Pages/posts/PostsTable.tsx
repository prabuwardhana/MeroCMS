import React, { useMemo, useState } from "react";
import { navigate } from "vike/client/router";
import { withFallback } from "vike-react-query";
import { BookPlus, PencilLine, RotateCcw } from "lucide-react";

import { useCategories } from "@/src/hooks/api/useCategories";
import { usePosts } from "@/src/hooks/api/usePosts";
import type { PostType } from "@/src/lib/types";

import { DeleteConfirmationDialog } from "@/components/Dialogs";
import { SkeletonTable } from "@/components/Skeletons";
import { DataTable } from "@/components/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getPostsColumns } from "./postsColumnDef";

export const PostsTable = withFallback(
  () => {
    const [postId, setPostId] = useState<string | null>();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

    const onEdit = (post: PostType) => {
      navigate(`/admin/posts/${post._id}/edit`);
    };

    const onDelete = (post: PostType) => {
      setPostId(post._id);
      setIsDeleteOpen(true);
    };

    const columns = useMemo(() => getPostsColumns({ onEdit, onDelete }), []);

    return (
      <>
        <DeleteConfirmationDialog
          title="Delete Post"
          description="Are you sure you want to delete this post?"
          objectId={postId as string}
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          mutate={deleteMutation.mutate}
        />
        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={postsQuery.data} columns={columns} type="posts" filterOn={filterOn} />
          </CardContent>
        </Card>
      </>
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
