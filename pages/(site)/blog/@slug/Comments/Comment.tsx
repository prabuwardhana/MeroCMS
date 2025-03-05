import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { formatDistance } from "date-fns";
import type { CommentDeleteMutationResponseType, CommentType } from "@/lib/types";
import Role from "@/constants/role";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentEditor } from "./CommentEditor";
import { CircleX, Loader2, PencilLine, Reply, Trash2 } from "lucide-react";

interface CommentProps {
  depth: number;
  commentData: CommentType;
  postSlug: string;
  addComment: (comment: CommentType) => void;
  removeComment: (comment: CommentType) => void;
  editComment: (comment: CommentType) => void;
  onCommentCountChange: (count: number) => void;
}

export const Comment = ({
  depth,
  commentData,
  postSlug,
  addComment,
  removeComment,
  editComment,
  onCommentCountChange,
}: CommentProps) => {
  const { user } = usePageContext();

  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState<CommentType>(commentData);
  const isAuthor = user && user._id === comment.author?._id;

  const queryClient = useQueryClient();
  const deleteCommentMutation = useMutation({
    mutationFn: async (id: string | null) => {
      try {
        const res = await fetch(`/api/comment/${id}`, {
          method: "DELETE",
        });
        return (await res.json()) as CommentDeleteMutationResponseType;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: async (response) => {
      onCommentCountChange(response?.commentCount as number);
      await queryClient.invalidateQueries({ queryKey: ["comment", postSlug] });
    },
  });

  const handleSetReplying = () => {
    if (user) {
      setReplying(!replying);
    } else {
      navigate("/auth/login");
    }
  };

  const handleAddReply = (comment: CommentType) => {
    addComment({ ...comment, createdAt: new Date(), author: user });
    setReplying(!replying);
  };

  const handleEdit = (content: string) => {
    const newComment = { ...comment, edited: true, content };
    editComment(newComment);
    setComment(newComment);
    setEditing(false);
  };

  const handleDelete = async () => {
    deleteCommentMutation.mutate(comment._id);
    removeComment(comment);
  };

  return (
    <div key={comment._id} className="space-y-4 border-l" style={{ marginLeft: `${depth ? 56 : 0}px` }}>
      <div className="flex gap-2 p-2">
        <Avatar>
          <AvatarImage src={comment.author?.profile.avatarUrl} className="w-10 h-10 object-cover" />
          <AvatarFallback className="text-black">
            {(comment.author?.profile.name as string).match(/\b(\w)/g)?.join("")}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2 flex-grow">
          <div className="flex items-center gap-1">
            <div className="text-sm font-bold">{comment.author?.profile.name}</div>
            <div className="flex items-center text-slate-400">{"·"}</div>
            <div className="flex gap-1 items-center text-slate-400">
              <Moment createdAt={comment.createdAt as Date} />
              {comment.edited && <span className="text-xs">(Edited)</span>}
            </div>
          </div>
          {!editing ? (
            <div dangerouslySetInnerHTML={{ __html: comment.content }}></div>
          ) : (
            <CommentEditor postSlug={postSlug} comment={comment} editing={editing} onEdit={handleEdit} />
          )}
          {replying && <CommentEditor postSlug={postSlug} comment={comment} onReply={handleAddReply} />}
          <div className="flex gap-2 text-xs">
            <button type="button" onClick={handleSetReplying} className="flex gap-1 items-center">
              {replying ? (
                <>
                  <CircleX size={12} className="text-destructive" />
                  <span className="text-destructive">cancel</span>
                </>
              ) : (
                <>
                  {deleteCommentMutation.isPending ? <Loader2 className="animate-spin" /> : <Reply size={12} />}
                  <span>reply</span>
                </>
              )}
            </button>
            {(isAuthor || (user && user.role?.includes(Role.Admin))) && (
              <>
                <button type="button" onClick={() => setEditing(!editing)} className="flex gap-1 items-center">
                  {editing ? (
                    <>
                      <CircleX size={12} className="text-destructive" />
                      <span className="text-destructive">cancel</span>
                    </>
                  ) : (
                    <>
                      <PencilLine size={12} />
                      <span>edit</span>
                    </>
                  )}
                </button>
                <button type="button" onClick={handleDelete} className="flex gap-1 items-center">
                  {deleteCommentMutation.isPending ? <Loader2 className="animate-spin" /> : <Trash2 size={12} />}
                  remove
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {comment.children &&
        comment.children.map((childComment) => (
          <div key={childComment._id}>
            <Comment
              commentData={childComment}
              postSlug={postSlug}
              depth={depth + 1}
              addComment={addComment}
              removeComment={removeComment}
              onCommentCountChange={onCommentCountChange}
              editComment={editComment}
            />
          </div>
        ))}
    </div>
  );
};

const Moment = ({ createdAt }: { createdAt: Date }) => {
  const currentTime = new Date();
  const dateTimeDistance = formatDistance(createdAt, currentTime, {
    addSuffix: true,
  });
  return <div className="text-xs">{dateTimeDistance}</div>;
};
