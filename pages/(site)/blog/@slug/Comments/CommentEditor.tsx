import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CommentMutationResponseType, CommentType } from "@/lib/types";
import { commentFormSchema } from "@/lib/schemas";

import { RichText } from "@/components/Field/TextInputs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

interface CommentEditorProps {
  postSlug: string;
  label?: string;
  comment?: CommentType;
  editing?: boolean;
  addComment?: (comment: CommentType) => void;
  onEdit?: (content: string) => void;
  onReply?: (comment: CommentType) => void;
}

export const CommentEditor = ({
  label,
  comment,
  postSlug,
  editing,
  addComment,
  onEdit,
  onReply,
}: CommentEditorProps) => {
  const queryClient = useQueryClient();
  const createCommentMutation = useMutation({
    mutationFn: async (data: CommentType) => {
      try {
        const res = await fetch(`/api/comment/post/${postSlug}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        return (await res.json()) as CommentMutationResponseType;
      } catch (err) {
        console.log(err);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments", postSlug] });
    },
    onSuccess: (response) => {
      if (addComment) addComment(response?.comment as CommentType);
      if (onReply) onReply(response?.comment as CommentType);
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async (data: CommentType) => {
      try {
        const res = await fetch(`/api/comment/${comment?._id}`, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        return (await res.json()) as CommentMutationResponseType;
      } catch (err) {
        console.log(err);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments", postSlug] });
    },
  });

  const formMethods = useForm<CommentType>({
    resolver: async (data, context, options) => {
      return zodResolver(commentFormSchema)(data, context, options);
    },
    defaultValues: {
      content: editing ? comment?.content : "",
    },
  });

  const handleSubmit: SubmitHandler<CommentType> = (formData) => {
    if (editing) {
      updateCommentMutation.mutate({
        ...formData,
      });
      if (onEdit) onEdit(formData.content);
    } else {
      const addedComment = {
        ...formData,
        parent: comment?._id ? comment._id : null,
      };
      createCommentMutation.mutate(addedComment);
    }
  };
  const handleSubmitError: SubmitErrorHandler<CommentType> = (formData) => {
    console.log(formData);
  };

  return (
    <Form {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(handleSubmit, handleSubmitError)}>
        <RichText
          control={formMethods.control}
          name="content"
          label={label as string}
          cleared={updateCommentMutation.isSuccess || createCommentMutation.isSuccess}
        />
        <div className="flex justify-end mt-4">
          {createCommentMutation.isError && "Error while Submitting the movie"}
          <Button type="submit" size={"sm"}>
            {createCommentMutation.isPending && <Loader2 className="animate-spin" />}
            {updateCommentMutation.isPending && <Loader2 className="animate-spin" />}
            {comment ? (!editing ? "Reply" : "Submit") : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
