import React, { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import { withFallback } from "vike-react-query";
import { CommentType } from "@/core/lib/types";
import Preloader from "@/components/Preloader";
import { Button } from "@/components/ui/button";
import { CommentEditor } from "./CommentEditor";
import { Comment } from "./Comment";
import { RotateCcw } from "lucide-react";

interface CommentsProp {
  commentCount: number;
  onCommentCountChange: (count: number) => void;
}

const Comments = withFallback(
  ({ commentCount, onCommentCountChange }: CommentsProp) => {
    const { routeParams } = usePageContext();

    const [comments, setComments] = useState<CommentType[] | null>(null);
    const [rerender, setRerender] = useState(false);

    const { data: commentsData } = useSuspenseQuery({
      queryKey: ["comments", routeParams.slug],
      queryFn: async () => {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}:${import.meta.env.VITE_PORT}/api/comment/post/${routeParams.slug}`,
        );
        return (await response.json()) as CommentType[];
      },
    });

    useEffect(() => {
      setComments(commentsData);
    }, [commentsData]);

    const findComment = (id: string): CommentType | null => {
      let commentToFind: CommentType | null = null;

      const traverseComments = (comment: CommentType, id: string) => {
        if (comment._id === id) {
          commentToFind = comment;
        } else if (comment.children) {
          comment.children.forEach((childComment) => {
            traverseComments(childComment, id);
          });
        }
      };

      comments?.forEach((comment) => {
        traverseComments(comment, id);
      });

      return commentToFind;
    };

    const removeComment = (removedComment: CommentType) => {
      if (removedComment.parent) {
        const parentComment = findComment(removedComment.parent);

        if (parentComment && parentComment.children) {
          parentComment.children = parentComment.children.filter((comment) => comment._id !== removedComment._id);
        }
        setRerender(!rerender);
      } else {
        if (comments) setComments(comments.filter((comment) => comment._id !== removedComment._id));
      }
    };

    const editComment = (editedComment: CommentType) => {
      if (editedComment.parent) {
        const parentComment = findComment(editedComment.parent);

        if (parentComment && parentComment.children) {
          parentComment.children.forEach((childComment) => {
            if (childComment._id === editedComment._id) {
              childComment = editedComment;
            }
          });
        }
      } else {
        comments?.forEach((comment) => {
          if (comment._id === editedComment._id) {
            comment = editedComment;
          }
        });

        setRerender(!rerender);
      }
    };

    const addComment = (comment: CommentType) => {
      if (comment.parent) {
        const parentComment = findComment(comment.parent);

        if (parentComment && parentComment.children) {
          parentComment.children = [comment, ...parentComment.children];
        }

        setRerender(!rerender);
      } else {
        setComments([comment, ...(comments as CommentType[])]);
      }

      onCommentCountChange(commentCount + 1);
    };

    return (
      <>
        <CommentEditor postSlug={routeParams.slug} label="What are your thoughts?" addComment={addComment} />
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id}>
              <Comment
                commentData={comment}
                postSlug={routeParams.slug}
                depth={0}
                addComment={addComment}
                removeComment={removeComment}
                onCommentCountChange={onCommentCountChange}
                editComment={editComment}
              />
            </div>
          ))
        ) : (
          <>No comment yet...</>
        )}
      </>
    );
  },
  () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-[calc(10px + 2vmin)]">
      <Preloader>Loading comments...</Preloader>
    </div>
  ),
  ({ retry, error }) => (
    <div>
      <div>Failed to load Post: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </div>
  ),
);

export default Comments;
