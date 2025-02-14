import React, { useEffect, useMemo, useRef, useState } from "react";

import { usePageContext } from "vike-react/usePageContext";
import { useForm, SubmitHandler, SubmitErrorHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withFallback } from "vike-react-query";
import { toast } from "sonner";
import { useDndMonitor, useDroppable } from "@dnd-kit/core";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Accordion from "@/components/ui/accordion";
import PageTitle from "@/components/PageTitle";
import ImageManagerDialog from "@/components/Dialogs/CoverImageDialog";

import { CloudinaryResourceType, PageComponentType, PageType } from "@/lib/types";
import { pageFormSchema } from "@/lib/schemas";
import { cn, slugify } from "@/lib/utils";

import { RotateCcw, Trash2 } from "lucide-react";
import { useGetSinglePostQuery } from "@/hooks/api/useGetSinglePostQuery";
import { useGetComponentQuery } from "@/hooks/api/useGetComponentsQuery";
import PageComponent from "./PageComponent";
import PageComponentButton from "@/components/PageComponentButton";
import { usePageComponentsStore } from "@/store/pageComponentsStore";

// import { useCreateUpdatePostMutation } from "@/hooks/api/useCreateUpdatePostMutation";

const CreateOrEditPage = withFallback(
  () => {
    const { user, routeParams } = usePageContext();
    const pageTitle = routeParams.id ? "Edit Page" : "Add New Page";

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

    const initialPageData = useMemo(
      () => ({
        _id: null,
        title: "",
        slug: "",
        fields: [],
        coverImage: initialCoverImageData,
        published: false,
        author: user?._id,
        updatedAt: null,
      }),
      [],
    );

    // global states
    const { pageComponents, setPageComponents } = usePageComponentsStore();

    // local states
    const [tab, setTab] = useState("gallery");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCoverImages, setSelectedCoverImages] = useState<Array<CloudinaryResourceType>>([]);
    const [pageData, setPageData] = useState<PageType>(initialPageData);

    const dialogRef = useRef<HTMLDialogElement>(null);

    const { componentsQuery } = useGetComponentQuery();
    const { postQuery } = useGetSinglePostQuery(routeParams.id);
    // const mutation = useCreateUpdatePostMutation(routeParams.id);

    // 1. Define our form.
    const formMethods = useForm<PageType>({
      // Integrate zod as the schema validation library
      resolver: async (data, context, options) => {
        return zodResolver(pageFormSchema)(data, context, options);
      },
      // form default states
      defaultValues: {
        title: pageData.title,
        slug: pageData.slug,
      },
    });

    const { fields, append, remove } = useFieldArray<PageType, "fields", "fieldId">({
      control: formMethods.control,
      name: "fields",
      keyName: "fieldId",
    });

    // 2. Define the form submit handler.
    const handleSubmit: SubmitHandler<PageType> = (formData) => {
      // Saves the content to DB.
      // mutation.mutate(formData);
      console.log(formData);
    };

    const handleSubmitError: SubmitErrorHandler<PageType> = (formData) => {
      console.log(formData);
      if (formData.fields?.root?.message) toast(formData.fields?.root?.message);
    };

    // In edit mode, loads the content from DB.
    useEffect(() => {
      if (routeParams.id && postQuery) {
        // const post: PageType = postQuery.data;
        // // replace postData with the new one from the DB
        // setPageData({ ...pageData, ...post });
        // setSelectedCategories(post.categories);
        // setLastSavedAt(post.updatedAt);
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
        title: pageData.title,
        slug: pageData.slug,
        fields: pageData.fields,
      });
    }, [reset, pageData]);

    useEffect(() => {
      if (modalOpen) dialogRef.current?.showModal();
      else dialogRef.current?.close();
    }, [modalOpen]);

    useEffect(() => {
      if (componentsQuery.data) setPageComponents(componentsQuery.data);
    }, [componentsQuery]);

    const onTabChange = (value: string) => {
      setTab(value);
    };

    const onCloseDialog = () => {
      setModalOpen(false);
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
      const newPageData: PageType = {
        ...pageData,
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

      setPageData(newPageData);
      dialogRef?.current?.close();
    };

    const droppable = useDroppable({
      id: "page-component-droppable-area",
      data: {
        isComponentDroppableArea: true,
      },
    });

    useDndMonitor({
      onDragEnd: (event) => {
        const { active, over } = event;

        if (!active || !over) return;

        const isComponentBtn = active?.data?.current?.isComponentBtn;

        if (isComponentBtn) {
          const type = active?.data?.current?.type;
          const selectedComponent = pageComponents.find((item) => item.title === type) as PageComponentType;
          const fieldNamesArray = selectedComponent?.fields.map((field) => `${field.name}_${field.type}`);
          const fieldLabelsArray = selectedComponent?.fields.map((field) => `${field.label}`);
          const fieldNamesObj = fieldNamesArray.reduce((o, key) => ({ ...o, [key]: "" }), {});

          append({
            ...fieldNamesObj,
            fieldLabels: fieldLabelsArray.join("_"),
            fieldsTitle: selectedComponent.title,
            fieldId: `${selectedComponent.title.replace(/\s/g, "-")}-${fields.length}`,
          });
        }
      },
    });

    return (
      <>
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(handleSubmit, handleSubmitError)}>
            <div className="flex flex-col gap-y-6 lg:flex-row lg:gap-x-6">
              <main className="basis-3/4 space-y-6">
                <div className="flex flex-col justify-center md:flex-row md:justify-between">
                  <PageTitle>{pageTitle}</PageTitle>
                  <div className="flex justify-between gap-x-6">
                    <Button type="submit" className="bg-primary text-secondary">
                      Create Page
                    </Button>
                  </div>
                </div>
                <FormField
                  control={formMethods.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-normal text-md text-primary">Title</FormLabel>
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
                      <FormLabel className="font-normal text-md text-primary">Generated Slug</FormLabel>
                      <FormControl>
                        <Input
                          className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <div className="text-md text-primary">Page Content ({fields.length})</div>
                  <div
                    ref={droppable.setNodeRef}
                    className={cn(
                      "border border-dashed border-primary/70 space-y-2 rounded-sm min-h-32 p-4 mb-10 bg-primary/10 flex flex-col flex-grow items-center justify-start",
                      droppable.isOver && "ring-2 ring-primary/20",
                    )}
                  >
                    {!droppable.isOver && fields.length === 0 && (
                      <p className="text-xl text-primary/70 flex flex-grow items-center">Drop a page component here.</p>
                    )}
                    {fields.length > 0 &&
                      fields.map((field, index) => (
                        <PageComponent
                          key={field._id?.toString() + index.toString()}
                          componentIndex={index}
                          field={field}
                          remove={remove}
                        />
                      ))}
                    {droppable.isOver && (
                      <div className="w-full">
                        <div className="h-[120px] rounded-sm bg-primary/20"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div></div>
              </main>
              <aside className="sticky top-0 flex h-[calc(100vh-theme(spacing.24))] basis-1/4 flex-col gap-y-8 overflow-y-hidden">
                <div className="bg-background border">
                  <Accordion title="Hero Image" open={true}>
                    {pageData.coverImage.secure_url ? (
                      <>
                        <img src={pageData.coverImage.secure_url} className="h-48 w-full object-cover rounded-md" />
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 flex justify-center items-center text-sm text-destructive"
                          onClick={() => {
                            const newPageData: PageType = {
                              ...pageData,
                              coverImage: initialCoverImageData,
                            };

                            setPageData(newPageData);
                            setSelectedCoverImages([]);
                          }}
                        >
                          <Trash2 />
                          Remove hero image
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
                        <span className="sr-only">Set Hero Image</span>
                        Set Hero Image
                      </Button>
                    )}
                  </Accordion>
                  <Accordion title="Page Components" open={true} className="space-y-2">
                    {pageComponents.map((pageComponent) => (
                      <PageComponentButton key={pageComponent._id?.toString()} pageComponent={pageComponent} />
                    ))}
                  </Accordion>
                </div>
              </aside>
            </div>
          </form>
        </Form>
        <ImageManagerDialog
          title="Cover Image"
          buttonText="Set Cover Image"
          ref={dialogRef}
          tab={tab}
          selected={selectedCoverImages}
          modalOpen={modalOpen}
          onTabChange={onTabChange}
          onImageSelected={onImageSelected}
          onClearSelectedImage={onClearSelectedImage}
          onSetImage={onSetCoverImage}
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

export default CreateOrEditPage;
