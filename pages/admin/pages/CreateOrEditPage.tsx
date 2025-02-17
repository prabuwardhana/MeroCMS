import React, { useEffect, useMemo, useState } from "react";

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

import { CirclePlus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useGetSinglePageQuery } from "@/hooks/api/useGetSinglePageQuery";
import { useGetComponentQuery } from "@/hooks/api/useGetComponentsQuery";
import { useCreateUpdatePageMutation } from "@/hooks/api/useCreateUpdatePageMutation";
import PageComponent from "./PageComponent";
import PageComponentButton from "@/components/PageComponentButton";
import { usePageComponentsStore } from "@/store/pageComponentsStore";

const CreateOrEditPage = withFallback(
  () => {
    const { user, routeParams } = usePageContext();
    const pageTitle = routeParams.id ? "Edit Page" : "Add New Page";

    const initialPageData = useMemo(
      () => ({
        _id: null,
        title: "",
        slug: "",
        fields: [],
        coverImageUrl: "",
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCoverImages, setSelectedCoverImages] = useState<Array<CloudinaryResourceType>>([]);
    const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>("");
    const [pageData, setPageData] = useState<PageType>(initialPageData);

    const { componentsQuery } = useGetComponentQuery();
    const { pageQuery } = useGetSinglePageQuery(routeParams.id);
    const mutation = useCreateUpdatePageMutation(routeParams.id);

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
        fields: pageData.fields,
        coverImageUrl: pageData.coverImageUrl,
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
      mutation.mutate({ ...pageData, ...formData });
      console.log(formData);
    };

    const handleSubmitError: SubmitErrorHandler<PageType> = (formData) => {
      console.log(formData);
      if (formData.fields?.root?.message) toast(formData.fields?.root?.message);
    };

    // In edit mode, loads the content from DB.
    useEffect(() => {
      if (routeParams.id && pageQuery) {
        const page: PageType = pageQuery.data;
        // replace postData with the new one from the DB
        setPageData({ ...pageData, ...page });
        setCoverImageUrl(page.coverImageUrl);
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
        coverImageUrl: pageData.coverImageUrl,
      });
    }, [reset, pageData]);

    useEffect(() => {
      if (componentsQuery.data) setPageComponents(componentsQuery.data);
    }, [componentsQuery]);

    useEffect(() => {
      if (selectedCoverImages.length > 0) formMethods.setValue("coverImageUrl", selectedCoverImages[0].secure_url);
    }, [selectedCoverImages]);

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
      setCoverImageUrl(selectedCoverImages[0].secure_url);
      formMethods.setValue("coverImageUrl", selectedCoverImages[0].secure_url);
      setIsDialogOpen(false);
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
                    <Button type="submit" className="bg-primary text-primary-foreground">
                      {routeParams.id ? <Save /> : <CirclePlus />}
                      {routeParams.id ? "Update Page" : "Create Page"}
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
                          className="box-border h-12 rounded-none border-t-0 border-l-0 border-r-0 border-b border-primary bg-transparent px-0 py-4 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 md:text-2xl"
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
                          className="box-border h-12 rounded-none border-t-0 border-l-0 border-r-0 border-b border-primary bg-transparent px-0 py-4 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
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
                <FormField
                  control={formMethods.control}
                  name="coverImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="hidden"
                          className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </main>
              <aside className="sticky top-0 flex h-[calc(100vh-theme(spacing.24))] basis-1/4 flex-col overflow-y-hidden">
                <Accordion className="border-b" title="Hero Image" open={true}>
                  {coverImageUrl ? (
                    <>
                      <img src={coverImageUrl} className="h-48 w-full object-cover rounded-md" />
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 flex justify-center items-center text-sm text-destructive"
                        onClick={() => {
                          setCoverImageUrl("");
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
                      onClick={() => setIsDialogOpen(true)}
                      className="h-20 w-full text-wrap rounded-sm border border-dashed border-accent-foreground bg-accent hover:bg-accent/50 text-sm text-accent-foreground transition-colors"
                    >
                      <span className="sr-only">Set Hero Image</span>
                      Set Hero Image
                    </Button>
                  )}
                </Accordion>
                <Accordion title="Page Components" open={true} className="border-b space-y-2">
                  {pageComponents.map((pageComponent) => (
                    <PageComponentButton key={pageComponent._id?.toString()} pageComponent={pageComponent} />
                  ))}
                </Accordion>
              </aside>
            </div>
          </form>
        </Form>
        <ImageManagerDialog
          title="Hero Image"
          buttonText="Set Hero Image"
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

export default CreateOrEditPage;
