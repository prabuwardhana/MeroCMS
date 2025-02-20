import React, { useEffect, useMemo, useState } from "react";

import { usePageContext } from "vike-react/usePageContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withFallback } from "vike-react-query";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Accordion from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import Editor from "@/components/blocknote/editor";
import SaveStatus from "@/components/SaveStatus";
import PageTitle from "@/components/PageTitle";
import ImageManagerDialog from "@/components/Dialogs/CoverImageDialog";
import ImageSetter from "@/components/ImageSetter";

import { CustomBlockNoteEditor, PostType, CloudinaryResourceType } from "@/lib/types";
import { postFormSchema } from "@/lib/schemas";
import { useAutoSave } from "@/hooks/useAutoSave";
import { cn, slugify } from "@/lib/utils";

import { CirclePlus, Eye, Globe, GlobeLock, RotateCcw, Save } from "lucide-react";
import { usePosts } from "@/hooks/api/usePosts";
import { useCategories } from "@/hooks/api/useCategories";
import { useCharacterCounter } from "@/hooks/useCharacterCounter";
import { dateStringOptions } from "@/constants/dateTimeOptions";

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
        _id: null,
        title: "",
        slug: "",
        excerpt: "",
        editorContent: undefined,
        coverImage: initialCoverImageData,
        categories: ["Uncategorized"],
        published: false,
        publishedAt: null,
        author: user?._id,
        updatedAt: null,
      }),
      [],
    );

    // local states
    const [tab, setTab] = useState("gallery");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [publishedAt, setPublishedAt] = useState("");
    const [selectedCoverImages, setSelectedCoverImages] = useState<Array<CloudinaryResourceType>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Array<string>>([]);
    const [postData, setPostData] = useState<PostType>(initialPostData);

    const { categoriesQuery } = useCategories();
    const { upsertMutation, postQuery } = usePosts(routeParams.id);

    // 1. Define our form.
    const formMethods = useForm<PostType>({
      // Integrate zod as the schema validation library
      resolver: async (data, context, options) => {
        return zodResolver(postFormSchema)(data, context, options);
      },
      // form states
      defaultValues: {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
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
        setPostData({ ...postData, ...post });
        setSelectedCategories(post.categories);
        setLastSavedAt(post.updatedAt);

        if (post.publishedAt) {
          const date = new Date(post.publishedAt as Date);
          setPublishedAt(date.toLocaleDateString("en-US", dateStringOptions));
        }
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
      if (postData.publishedAt) {
        const date = new Date(postData.publishedAt as Date);
        setPublishedAt(date.toLocaleDateString("en-US", dateStringOptions));
      }
      countCharacter(postData.excerpt?.length as number);
      reset({
        title: postData.title,
        slug: postData.slug,
        editorContent: postData.editorContent,
        excerpt: postData.excerpt,
      });
    }, [reset, postData]);

    const { dispatchAutoSave, triggerManualSave, isPendingSave, isSaving, isError } = useAutoSave({
      onSave: (data) => {
        if (!data.title || !data.slug) return;

        const currentTime = new Date();
        setLastSavedAt(currentTime);
        upsertMutation.mutate(data as PostType);
      },
    });

    const { textLength, maxLength, countCharacter } = useCharacterCounter(160);

    const onTabChange = (value: string) => {
      setTab(value);
    };

    const onImageSelected = (isChecked: boolean, image: CloudinaryResourceType) => {
      setSelectedCoverImages((prev) => {
        if (!isChecked) {
          const ret = Array.from(new Set([...(prev || []), image]));
          return ret.filter((id) => id === image);
        } else {
          return prev.filter((id) => id !== image);
        }
      });
    };

    const onClearSelectedImage = () => {
      setSelectedCoverImages([]);
    };

    const onSetCoverImage = () => {
      const newPostData: PostType = {
        ...postData,
        coverImage: {
          public_id: selectedCoverImages[0].public_id,
          secure_url: selectedCoverImages[0].secure_url,
          display_name: selectedCoverImages[0].display_name,
          format: selectedCoverImages[0].format,
          width: selectedCoverImages[0].width,
          height: selectedCoverImages[0].height,
          bytes: selectedCoverImages[0].bytes,
          tags: selectedCoverImages[0].tags,
          created_at: selectedCoverImages[0].created_at,
        },
      };

      dispatchAutoSave(newPostData);
      setPostData(newPostData);
      setIsDialogOpen(false);
    };

    const onPublish = () => {
      if (postData.published) {
        setPostData({ ...postData, published: false, publishedAt: null });
        triggerManualSave({ ...postData, published: false, publishedAt: null });
        setPublishedAt("");
      } else {
        const publishedAt = new Date();
        setPostData({ ...postData, published: true, publishedAt: publishedAt.toISOString() });
        triggerManualSave({ ...postData, published: true, publishedAt: publishedAt.toISOString() });
      }
    };

    return (
      <>
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-y-6 xl:flex-row xl:gap-x-6">
              <main className="basis-3/4 space-y-8">
                <div>
                  <div className="mb-4 flex flex-col justify-center md:flex-row md:justify-between">
                    <div className="flex justify-start gap-4">
                      <PageTitle>{pageTitle}</PageTitle>
                      <a
                        href={`/preview/${routeParams.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-start gap-1 items-center text-sm text-foreground hover:text-primary border rounded-md border-foreground hover:border-primary px-2 py-1"
                      >
                        <Eye size={16} />
                        Preview
                      </a>
                    </div>
                    <div className="flex justify-between gap-x-6">
                      <SaveStatus
                        savedAt={lastSavedAt}
                        isPendingSave={isPendingSave}
                        isSaving={isSaving}
                        isError={isError}
                      />
                      <Button type="submit" size={"sm"} className="bg-primary text-primary-foreground">
                        {routeParams.id ? <Save /> : <CirclePlus />}
                        {routeParams.id ? "Update Post" : "Create Post"}
                      </Button>
                      {routeParams.id && (
                        <Button
                          type="button"
                          size={"sm"}
                          onClick={onPublish}
                          className={cn(
                            postData.published && "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                            !postData.published && "bg-primary hover:bg-primary/90 text-primary-foreground",
                          )}
                        >
                          {postData.published ? <GlobeLock /> : <Globe />}
                          {postData.published ? "Unpublish" : "Publish"}
                        </Button>
                      )}
                    </div>
                  </div>
                  {publishedAt && (
                    <div className="flex justify-end text-xs text-primary">published on {publishedAt}</div>
                  )}
                </div>
                <FormField
                  control={formMethods.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-primary">Title</FormLabel>
                      <FormControl>
                        <Input
                          className="box-border h-12 rounded-none border-t-0 border-l-0 border-r-0 border-b border-primary bg-transparent px-0 py-4 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 md:text-2xl"
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
                          className="box-border h-12 rounded-none border-t-0 border-l-0 border-r-0 border-b border-primary bg-transparent px-0 py-4 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
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
              <aside className="sticky top-[84px] flex h-[calc(100vh-160px)] basis-1/4 flex-col overflow-y-hidden">
                <Accordion className="border-b" title="Cover Image" open={true}>
                  <ImageSetter
                    type="Cover"
                    imageUrl={postData.coverImage.secure_url}
                    onSetImageClick={() => setIsDialogOpen(true)}
                    onRemoveImageClick={() => {
                      const newPostData: PostType = {
                        ...postData,
                        coverImage: initialCoverImageData,
                      };

                      dispatchAutoSave(newPostData);
                      setPostData(newPostData);
                      setSelectedCoverImages([]);
                    }}
                  />
                </Accordion>
                <Accordion className="border-b" title="Categories">
                  {categoriesQuery.data.map((category) => {
                    const isChecked = selectedCategories.includes(category.name);
                    return (
                      <div key={category.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.name}
                          checked={isChecked}
                          onCheckedChange={(checked: boolean) => {
                            const newSelectedCategories = checked
                              ? Array.from(new Set([...(postData.categories || []), category.name]))
                              : postData.categories.filter((name) => name !== category.name);

                            setSelectedCategories(newSelectedCategories);

                            const newPostData: PostType = {
                              ...postData,
                              categories: newSelectedCategories,
                            };

                            dispatchAutoSave(newPostData);
                            setPostData(newPostData);
                          }}
                          className="text-card-foreground"
                        />
                        <label
                          htmlFor={category.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category.name}
                        </label>
                      </div>
                    );
                  })}
                </Accordion>
                <Accordion className="border-b" title="Meta Description">
                  <FormField
                    control={formMethods.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormDescription className="text-xs">
                          Short and relevant summary of what this blog post is about.
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            className="box-border min-h-[156px] bg-background"
                            onChange={(e) => {
                              // send back data to hook form (update formState)
                              field.onChange(e.target.value);

                              countCharacter(e.target.value.length as number);

                              dispatchAutoSave({
                                ...postData,
                                excerpt: e.target.value,
                              });
                            }}
                            value={field.value}
                            maxLength={maxLength}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end text-xs">
                    <span className={cn("", textLength > maxLength - 10 && "text-destructive")}>{textLength}</span>/
                    {maxLength}
                  </div>
                </Accordion>
              </aside>
            </div>
          </form>
        </Form>
        <ImageManagerDialog
          title="Cover Image"
          buttonText="Set Cover Image"
          tab={tab}
          selected={selectedCoverImages}
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onTabChange={onTabChange}
          onImageSelected={onImageSelected}
          onClearSelectedImage={onClearSelectedImage}
          onSetImage={onSetCoverImage}
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
