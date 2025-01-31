import React, { useEffect, useMemo, useRef, useState } from "react";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { usePageContext } from "vike-react/usePageContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withFallback } from "vike-react-query";
import { navigate } from "vike/client/router";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Editor from "@/components/blocknote/editor";
import SaveStatus from "@/components/SaveStatus";
import PageTitle from "@/components/PageTitle";

import { PostMutationResponseType, CustomBlockNoteEditor, PostType, CloudinaryResourceType } from "@/lib/types";
import { useAutoSave } from "@/hooks/useAutoSave";
import { formSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import API from "@/config/apiClient";

import { RotateCcw, Trash2 } from "lucide-react";
import ImageManagerDialog from "./ImageManagerDialog";
import Accordion from "@/components/ui/accordion";

const CreateOrEditPost = withFallback(
  () => {
    const { user, routeParams } = usePageContext();
    const pageTitle = routeParams.id ? "Edit Post" : "Add New Post";

    const initialCoverImageData = useMemo(
      () => ({
        public_id: "",
        secure_url: "",
        display_name: "",
        format: "",
        width: 0,
        height: 0,
        bytes: 0,
        tags: [],
        created_at: "",
      }),
      [],
    );

    const initialPostData = useMemo(
      () => ({
        title: "",
        slug: "",
        editorContent: undefined,
        coverImage: initialCoverImageData,
        published: false,
        authorId: user?.id,
        updatedAt: null,
      }),
      [],
    );

    // local states
    const [tab, setTab] = useState("gallery");
    const [modalOpen, setModalOpen] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<Date | undefined | null>(null);
    const [selectedImages, setSelectedImages] = useState<Array<CloudinaryResourceType>>([]);
    const [postData, setPostData] = useState<PostType>(initialPostData);

    const dialogRef = useRef<HTMLDialogElement>(null);

    const queryClient = useQueryClient();

    const { data: postQuery } = useSuspenseQuery({
      queryKey: ["post", routeParams.id],
      queryFn: async () => {
        // useSuspenseQuery and enabled v5
        // https://github.com/TanStack/query/discussions/6206
        return routeParams.id ? await API.get<PostType>(`/api/post/edit/${routeParams.id}`) : null;
      },
      staleTime: 60 * 1000,
    });

    const mutation = useMutation({
      mutationFn: async (data: PostType) => {
        return API.post<PostMutationResponseType>("/api/post/upsert", { ...data, _id: routeParams.id });
      },
      onSuccess: async (response) => {
        await queryClient.invalidateQueries({ queryKey: ["post", routeParams.id] });
        // In create mode, navigate to edit post page after successful mutation
        if (!routeParams.id) {
          const data = response.data;
          navigate(`/admin/posts/${data.post._id}/edit`);
        }
      },
    });

    // 1. Define our form.
    const formMethods = useForm<PostType>({
      // Integrate zod as the schema validation library
      resolver: async (data, context, options) => {
        return zodResolver(formSchema)(data, context, options);
      },
      // form states
      defaultValues: {
        title: postData.title,
        slug: postData.slug,
        editorContent: useMemo(() => {
          if (postData.editorContent === "loading") {
            return undefined;
          }

          return postData.editorContent;
        }, [postData.editorContent]),
      },
    });

    // 2. Define the form submit handler.
    const handleSubmit: SubmitHandler<PostType> = (formData) => {
      // Saves the content to DB.
      triggerManualSave({ ...postData, ...formData });
    };

    // In edit mode, loads the content from DB.
    useEffect(() => {
      if (routeParams.id && postQuery) {
        const post: PostType = postQuery.data;
        // replace postData with the new one from the DB
        setPostData(post);
        setLastSavedAt(post.updatedAt);
      }
    }, [routeParams.id]);

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
        title: postData.title,
        slug: postData.slug,
        editorContent: postData.editorContent,
      });
    }, [reset, postData]);

    useEffect(() => {
      if (modalOpen) dialogRef.current?.showModal();
      else dialogRef.current?.close();
    }, [modalOpen]);

    const { dispatchAutoSave, triggerManualSave, isPendingSave, isSaving, isError } = useAutoSave({
      onSave: (data: PostType) => {
        const currentTime = new Date();
        setLastSavedAt(currentTime);
        mutation.mutate(data);
      },
    });

    const onTabChange = (value: string) => {
      setTab(value);
    };

    const onCloseDialog = () => {
      setModalOpen(false);
    };

    const onImageSelected = (isChecked: boolean, image: CloudinaryResourceType) => {
      setSelectedImages((prev) => {
        if (!isChecked) {
          const ret = Array.from(new Set([...(prev || []), image]));
          return ret.filter((id) => id === image);
        } else {
          return prev.filter((id) => id !== image);
        }
      });
    };

    const onClearSelectedImage = () => {
      setSelectedImages([]);
    };

    const onSetCoverImage = () => {
      const newPostData: PostType = {
        ...postData,
        coverImage: {
          public_id: selectedImages[0].public_id,
          secure_url: selectedImages[0].secure_url,
          display_name: selectedImages[0].display_name,
          format: selectedImages[0].format,
          width: selectedImages[0].width,
          height: selectedImages[0].height,
          bytes: selectedImages[0].bytes,
          tags: selectedImages[0].tags,
          created_at: selectedImages[0].created_at,
        },
      };

      dispatchAutoSave(newPostData);
      setPostData(newPostData);
      dialogRef?.current?.close();
    };

    return (
      <>
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-y-6 lg:flex-row lg:gap-x-6">
              <main className="basis-3/4 space-y-8">
                <div className="mb-6 flex flex-col justify-center md:flex-row md:justify-between">
                  <PageTitle>{pageTitle}</PageTitle>
                  <div className="flex justify-between gap-x-6">
                    <SaveStatus
                      savedAt={lastSavedAt}
                      isPendingSave={isPendingSave}
                      isSaving={isSaving}
                      isError={isError}
                    />
                    <Button type="submit" className="bg-primary text-secondary">
                      Update Post
                    </Button>
                  </div>
                </div>
                <FormField
                  control={formMethods.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-primary">Title</FormLabel>
                      <FormControl>
                        <Input
                          className="box-border h-12 rounded-md border bg-background py-4 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 md:text-2xl"
                          placeholder="Enter Title Here"
                          onChange={(e) => {
                            // send back data to hook form (update formState)
                            field.onChange(e.target.value);

                            // create slug for the title
                            const slug = slugify(e.target.value);

                            // Set the value for the slug field
                            formMethods.setValue("slug", slug);

                            dispatchAutoSave({
                              ...postData,
                              title: e.target.value,
                              slug,
                            });
                          }}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formMethods.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-primary">Generated Slug</FormLabel>
                      <FormControl>
                        <Input
                          className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                          value={field.value}
                          onChange={(e) => {
                            // send back data to hook form (update formState)
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formMethods.control}
                  name="editorContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-primary">Content</FormLabel>
                      <FormControl>
                        <Editor
                          initialContent={postData.editorContent}
                          onChange={(editor: CustomBlockNoteEditor) => {
                            // send back data to hook form (update formState)
                            field.onChange(editor.document);

                            dispatchAutoSave({
                              ...postData,
                              editorContent: editor.document,
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </main>
              <aside className="sticky top-0 flex h-[calc(100vh-theme(spacing.24))] basis-1/4 flex-col gap-y-8 overflow-y-hidden">
                <div className="bg-background border">
                  <Accordion title="Cover Image" open={true}>
                    {postData.coverImage.secure_url ? (
                      <>
                        <img src={postData.coverImage.secure_url} className="h-48 w-full object-cover rounded-md" />
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 flex justify-center items-center text-sm text-destructive"
                          onClick={() => {
                            const newPostData: PostType = {
                              ...postData,
                              coverImage: initialCoverImageData,
                            };

                            dispatchAutoSave(newPostData);
                            setPostData(newPostData);
                            setSelectedImages([]);
                          }}
                        >
                          <Trash2 />
                          Remove cover image
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => {
                          setModalOpen(true);
                        }}
                        className="h-20 w-full text-wrap rounded-sm border border-dashed border-gray-600 bg-gray-100 text-sm text-secondary-foreground transition-colors hover:bg-gray-300"
                      >
                        <span className="sr-only">Set Cover Image</span>
                        Set Cover Image
                      </Button>
                    )}
                  </Accordion>
                  <Accordion title="Categories">content</Accordion>
                </div>
              </aside>
            </div>
          </form>
        </Form>
        <ImageManagerDialog
          ref={dialogRef}
          tab={tab}
          selected={selectedImages}
          modalOpen={modalOpen}
          onTabChange={onTabChange}
          onImageSelected={onImageSelected}
          onClearSelectedImage={onClearSelectedImage}
          onSetCoverImage={onSetCoverImage}
          onCloseDialog={onCloseDialog}
        />
      </>
    );
  },
  () => <div>Loading Post...</div>,
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

export default CreateOrEditPost;
