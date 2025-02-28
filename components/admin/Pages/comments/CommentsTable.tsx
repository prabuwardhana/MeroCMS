import React, { useMemo, useState } from "react";
import { withFallback } from "vike-react-query";

import type { CommentType, PostType } from "@/lib/types";
import { useComments } from "@/hooks/api/useComments";

import { DataTable } from "@/components/admin/DataTable";
import { SkeletonTable } from "@/components/admin/Skeletons";
import { DeleteConfirmationDialog } from "@/components/admin/Dialogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getCommentsColumns } from "./commentsColumnDef";
import { CreateOrEditComment } from "./CreateOrEditComment";

import { RotateCcw, ShieldAlert, ShieldCheck } from "lucide-react";

export const CommentsTable = withFallback(
  () => {
    const [commentId, setCommentId] = useState<string | null>();
    const [commentAuthor, setCommentAuthor] = useState<string | undefined>();
    const [post, setPost] = useState<Pick<PostType, "title" | "slug">>();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { commentsQuery, approveMutation, deleteMutation } = useComments();

    const filterOn = useMemo(
      () => [
        {
          column: "approved",
          title: "Approval Status",
          options: [
            {
              value: "true",
              label: "Approved",
              icon: ShieldCheck,
            },
            {
              value: "false",
              label: "Pending",
              icon: ShieldAlert,
            },
          ],
        },
      ],
      [],
    );

    const onApprove = (comment: CommentType) => {
      approveMutation.mutate(comment._id);
    };

    const onReply = (comment: CommentType) => {
      setCommentId(comment._id);
      setCommentAuthor(comment.author?.profile.name);
      setPost(comment.post);
      setIsReplyOpen(true);
    };

    const onEdit = (comment: CommentType) => {
      setCommentId(comment._id);
      setPost(comment.post);
      setIsEditOpen(true);
    };

    const onDelete = (comment: CommentType) => {
      setCommentId(comment._id);
      setIsDeleteOpen(true);
    };

    const columns = useMemo(() => getCommentsColumns({ onApprove, onReply, onEdit, onDelete }), []);

    return (
      <>
        <DeleteConfirmationDialog
          title="Delete Comment"
          description="Are you sure you want to delete this comment?"
          objectId={commentId as string}
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          mutate={deleteMutation.mutate}
        />
        <CreateOrEditComment
          replyTo={commentId?.toString()}
          commentAuthor={commentAuthor}
          post={post}
          isOpen={isReplyOpen}
          setIsOpen={setIsReplyOpen}
        />
        <CreateOrEditComment
          commentId={commentId?.toString()}
          post={post}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={commentsQuery.data} columns={columns} type="comments" filterOn={filterOn} />
          </CardContent>
        </Card>
      </>
    );
  },
  () => <SkeletonTable />,
  ({ retry, error }) => (
    <div>
      <div>Failed to load Comments: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </div>
  ),
);
