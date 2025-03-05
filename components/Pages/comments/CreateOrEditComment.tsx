import React, { useEffect, useMemo, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { CommentType, PostType } from "@/src/lib/types";
import { useComments } from "@/src/hooks/api/useComments";
import { commentFormSchema } from "@/src/lib/schemas";

import { LongText } from "@/components/Field/TextInputs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

interface CreateOrEditCommentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  replyTo?: string;
  commentId?: string;
  commentAuthor?: string;
  post?: Pick<PostType, "title" | "slug">;
}
export const CreateOrEditComment = ({
  isOpen,
  setIsOpen,
  commentId,
  commentAuthor,
  replyTo,
  post,
}: CreateOrEditCommentProps) => {
  const initialCommentData = useMemo(
    () => ({
      _id: null,
      author: null,
      content: "",
      parent: null,
      post: {
        title: "",
        slug: "",
      },
      edited: false,
      approved: false,
    }),
    [],
  );

  // local states
  const [commentData, setCommentData] = useState<CommentType>(initialCommentData);

  const { commentQuery, createMutation, editMutation } = useComments(commentId);

  // 1. Define our form.
  const formMethods = useForm<CommentType>({
    // Integrate zod as the schema validation library
    resolver: async (data, context, options) => {
      return zodResolver(commentFormSchema)(data, context, options);
    },
    // form states
    defaultValues: {
      content: commentData.content,
    },
  });

  // 2. Define the form submit handler.
  const handleSubmit: SubmitHandler<CommentType> = (formData) => {
    // Saves the content to DB.
    if (replyTo && post)
      createMutation.mutate({
        ...formData,
        parent: replyTo,
        post,
      });
    else editMutation.mutate({ ...formData, _id: commentId! });
    setIsOpen(false);
  };
  const handleSubmitError: SubmitErrorHandler<CommentType> = (formData) => {
    console.log(formData);
  };

  // In edit mode, loads the content from DB.
  useEffect(() => {
    if (commentId && commentQuery) {
      const comment: CommentType = commentQuery.data;
      // replace postData with the new one from the DB
      setCommentData(comment);
    }
  }, [commentId]);

  // The following useEffect expects formMethods as dependency
  // when formMethods.reset is called within useEffect.
  // Adding the entire return value of useForm to a useEffect dependency list
  // may lead to infinite loops.
  // https://github.com/react-hook-form/react-hook-form/issues/12463
  const reset = useMemo(() => formMethods.reset, [formMethods.reset]);

  // Reset the form states when the previously stored
  // post data has been loaded sucessfuly from the DB
  useEffect(() => {
    reset({
      content: commentData.content,
    });
  }, [reset, commentData]);

  // Reset the form states on successful submition
  useEffect(() => {
    if (formMethods.formState.isSubmitSuccessful) {
      reset({ ...commentData });
    }
  }, [formMethods.formState, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>{replyTo ? `Replying to ${commentAuthor}` : "Edit Comment"}</DialogTitle>
          <DialogDescription className="text-xs">
            In response to <span className="font-bold text-primary">{post?.title}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(handleSubmit, handleSubmitError)}>
            <LongText control={formMethods.control} name="content" label="comment" />
            <DialogFooter className="md:justify-end mt-4">
              <Button type="submit" size={"sm"}>
                {replyTo ? "Post " : "Edit "}Comment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
