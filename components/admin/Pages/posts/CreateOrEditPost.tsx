import React, { useEffect, useMemo, useState } from "react";

import { usePageContext } from "vike-react/usePageContext";
import { useCreateBlockNote } from "@blocknote/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withFallback } from "vike-react-query";

import ImageManagerDialog from "@/components/admin/Dialogs/CoverImageDialog";
import { type CustomBlockNoteEditor, CustomPartialBlock, Editor, schema } from "@/components/admin/Blocknote";
import { SkeletonPostEditor } from "@/components/admin/Skeletons";
import ImageSetter from "@/components/admin/ImageSetter";
import SaveStatus from "@/components/admin/SaveStatus";
import PageTitle from "@/components/admin/AdminPageTitle";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Accordion from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { dateStringOptions } from "@/constants/dateTimeOptions";
import { useCharacterCounter } from "@/hooks/useCharacterCounter";
import { useCategories } from "@/hooks/api/useCategories";
import { useAutoSave } from "@/hooks/useAutoSave";
import { usePosts } from "@/hooks/api/usePosts";
import type { PostType, CloudinaryResourceType } from "@/lib/types";
import { postFormSchema } from "@/lib/schemas";
import { cn, slugify } from "@/lib/utils";

import { CirclePlus, Eye, Globe, GlobeLock, Loader2, RotateCcw, Save, SquareArrowOutUpRight } from "lucide-react";

export const CreateOrEditPost = withFallback(
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
        editorDocument: undefined,
        documentJson: undefined,
        documentHtml: undefined,
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
    const [isUpdating, setIsUpdating] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [publishedAt, setPublishedAt] = useState<string | null>("");
    const [isPublishing, setIsPublishing] = useState(false);
    const [selectedCoverImages, setSelectedCoverImages] = useState<Array<CloudinaryResourceType>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Array<string>>([]);
    const [postData, setPostData] = useState<PostType>(initialPostData);
    const [html, setHtml] = useState("");

    const { categoriesQuery } = useCategories();
    const { upsertMutation, publishMutation, postQuery } = usePosts(routeParams.id, setIsPublishing, setIsUpdating);

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
        documentJson: postData.documentJson,
      },
    });

    // 2. Define the form submit handler.
    const handleSubmit: SubmitHandler<PostType> = (formData) => {
      console.log(html);
      // Saves the content to DB.
      triggerManualSave({ ...postData, ...formData, documentHtml: html });
    };

    // In edit mode, loads the content from DB.
    useEffect(() => {
      if (routeParams.id && postQuery) {
        const post: PostType = postQuery.data;
        // replace postData with the new one from the DB
        setPostData({ ...post, editorContent: JSON.parse(post.documentJson as string) });
        setSelectedCategories(post.categories);
        setLastSavedAt(post.updatedAt);

        if (post.publishedAt) {
          const date = new Date(post.publishedAt as Date);
          setPublishedAt(date.toLocaleDateString("en-US", dateStringOptions));
        } else {
          setPublishedAt(null);
        }
      }
    }, [routeParams.id, postQuery?.data]);

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
        documentJson: postData.documentJson,
        excerpt: postData.excerpt,
      });
    }, [reset, postData]);

    useEffect(() => {
      countCharacter(postData.excerpt?.length as number);
    }, [postData.excerpt]);

    const { dispatchAutoSave, triggerManualSave, isPendingSave, isSaving, isError } = useAutoSave({
      onSave: (data) => {
        if (!data.title || !data.slug) return;
        setIsUpdating(true);
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
      setIsPublishing(true);
      if (postData.published) {
        publishMutation.mutate(routeParams.id);
      } else {
        publishMutation.mutate(routeParams.id);
      }
    };

    // ⚠️ This is just a workaround. Need to redo this in the future!
    // Save the HTML version of our block editor content.
    // We actually don't need to instantiate another editor instance.
    // But for our case, we need to disable the editable props
    // because we want to convert the CodeBlock component instead of
    // the CodeBlockEditor.
    // Using the actual editor to convert the document to HTML
    // will convert the CodeBlockEditor instead.
    // Disable editing for the actual editor?
    // The actual editor will no longer editable, so we cannot type anything.
    const editor = useCreateBlockNote({ schema });
    const onEditorChange = async (document: CustomPartialBlock[]) => {
      editor.isEditable = false;
      const html = await editor.blocksToFullHTML(document);
      setHtml(html);
      dispatchAutoSave({
        ...postData,
        documentJson: JSON.stringify(document),
        documentHtml: html,
      });
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
                      {routeParams.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex justify-start gap-1 items-center text-sm text-foreground hover:text-primary border rounded-md border-foreground hover:border-primary px-2 py-1"
                            >
                              <Eye size={16} />
                              view
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <a href={`/preview/${routeParams.id}`} target="_blank" rel="noopener noreferrer">
                                Preview Post
                              </a>
                            </DropdownMenuItem>
                            {postData.published && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <a
                                    href={`/blog/${postData.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                  >
                                    Visit Blog Post
                                    <SquareArrowOutUpRight />
                                  </a>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <div className="flex justify-between gap-x-6">
                      <SaveStatus
                        savedAt={lastSavedAt}
                        isPendingSave={isPendingSave}
                        isSaving={isSaving}
                        isError={isError}
                      />
                      <Button type="submit" size={"sm"} className="bg-primary text-primary-foreground">
                        {routeParams.id ? isUpdating ? <Loader2 className="animate-spin" /> : <Save /> : <CirclePlus />}
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
                          {isPublishing ? (
                            <Loader2 className="animate-spin" />
                          ) : postData.published ? (
                            <GlobeLock />
                          ) : (
                            <Globe />
                          )}
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
                  name="documentJson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-primary">Content</FormLabel>
                      <FormControl>
                        <Editor
                          initialContent={postData.editorContent}
                          onChange={(editor: CustomBlockNoteEditor) => {
                            // send back data to hook form (update formState)
                            field.onChange(JSON.stringify(editor.document));
                            onEditorChange(editor.document);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </main>
              <aside className="sticky top-[84px] flex h-[calc(100vh-160px)] basis-1/4 flex-col overflow-y-hidden">
                <Accordion className="border-b text-sm" title="Cover Image" open={true}>
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
                <Accordion className="border-b text-sm" title="Categories">
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
                <Accordion className="border-b text-sm" title="Meta Description">
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
  () => <SkeletonPostEditor />,
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
