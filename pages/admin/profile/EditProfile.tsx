import React, { useEffect, useMemo, useRef, useState } from "react";

import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePageContext } from "vike-react/usePageContext";
import { withFallback } from "vike-react-query";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageManagerDialog from "@/components/Dialogs";

import { CloudinaryResourceType, UserProfile } from "@/lib/types";
import { profileFormSchema } from "@/lib/schemas";

import { useUpdateProfileMutation } from "@/hooks/api/useUpdateProfileMutation";

import { RotateCcw, Trash2 } from "lucide-react";

const EditProfile = withFallback(
  () => {
    const { user } = usePageContext();

    const initialUserData = useMemo(
      () => ({
        userId: null,
        name: "",
        username: "",
        biography: "",
        avatarUrl: "",
      }),
      [],
    );

    // local states
    const [userProfileData, setUserProfileData] = useState<UserProfile>(initialUserData);
    const [tab, setTab] = useState("gallery");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<Array<CloudinaryResourceType>>([]);

    const dialogRef = useRef<HTMLDialogElement>(null);

    const mutation = useUpdateProfileMutation();

    // 1. Define our form.
    const formMethods = useForm<UserProfile>({
      // Integrate zod as the schema validation library
      resolver: async (data, context, options) => {
        return zodResolver(profileFormSchema)(data, context, options);
      },
      // form states
      defaultValues: {
        name: userProfileData.name,
        username: userProfileData.username,
        biography: userProfileData.biography,
        avatarUrl: userProfileData.avatarUrl,
      },
    });

    // 2. Define the form submit handler.
    const handleSubmit: SubmitHandler<UserProfile> = (formData) => {
      // Saves the content to DB.
      mutation.mutate(formData);
    };

    const handleSubmitError: SubmitErrorHandler<UserProfile> = (formData) => {
      console.log(formData);
    };

    // Get the user from the page context provided by Vike.
    useEffect(() => {
      if (user) {
        const profile: UserProfile = user.profile;
        // replace postData with the new one from the DB
        setUserProfileData(profile);
      }
    }, [user]);

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
        name: userProfileData.name,
        username: userProfileData.username,
        biography: userProfileData.biography,
        avatarUrl: userProfileData.avatarUrl,
      });
    }, [reset, userProfileData]);

    useEffect(() => {
      if (selectedAvatar.length) formMethods.setValue("avatarUrl", selectedAvatar[0].secure_url);
    }, [selectedAvatar]);

    useEffect(() => {
      if (modalOpen) dialogRef.current?.showModal();
      else dialogRef.current?.close();
    }, [modalOpen]);

    const onTabChange = (value: string) => {
      setTab(value);
    };

    const onCloseDialog = () => {
      setModalOpen(false);
    };

    const onImageSelected = (isChecked: boolean, image: CloudinaryResourceType) => {
      setSelectedAvatar((prev) => {
        if (!isChecked) {
          const ret = Array.from(new Set([...(prev || []), image]));
          return ret.filter((id) => id === image);
        } else {
          return prev.filter((id) => id !== image);
        }
      });
    };

    const onClearSelectedImage = () => {
      setSelectedAvatar([]);
    };

    const onSetAvatar = () => {
      const newUserProfileData: UserProfile = {
        ...userProfileData,
        avatarUrl: selectedAvatar[0].secure_url,
      };

      setUserProfileData(newUserProfileData);
      dialogRef?.current?.close();
    };

    return (
      <>
        <div className="flex flex-col gap-y-6 md:flex-row md:gap-x-6">
          <main className="basis-1/2">
            <Form {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(handleSubmit, handleSubmitError)}>
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-x-6">
                      <div className="basis-2/3">
                        <FormField
                          control={formMethods.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="mb-3">
                              <FormLabel className="text-xs font-bold uppercase text-primary">Name</FormLabel>
                              <FormControl>
                                <Input
                                  className="box-border h-12 rounded-md border bg-background py-4 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                                  placeholder="Enter your name here"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formMethods.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem className="mb-3">
                              <FormLabel className="text-xs font-bold uppercase text-primary">Username</FormLabel>
                              <FormControl>
                                <Input
                                  className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                                  placeholder="Enter your username here"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formMethods.control}
                          name="biography"
                          render={({ field }) => (
                            <FormItem className="mb-3">
                              <FormLabel className="text-xs font-bold uppercase text-primary">
                                Biographical Info
                              </FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="basis-1/3">
                        <FormField
                          control={formMethods.control}
                          name="avatarUrl"
                          render={({ field }) => (
                            <FormItem className="mb-2">
                              <FormLabel className="text-xs font-bold uppercase text-primary">Avatar</FormLabel>
                              <FormControl>
                                <input {...field} type="hidden" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {userProfileData.avatarUrl ? (
                          <>
                            <img src={userProfileData.avatarUrl} className="h-48 w-full object-cover rounded-md" />
                            <Button
                              type="button"
                              variant="link"
                              className="p-0 flex justify-center items-center text-sm text-destructive"
                              onClick={() => {
                                const newUserProfileData: UserProfile = {
                                  ...userProfileData,
                                  avatarUrl: "",
                                };

                                setUserProfileData(newUserProfileData);
                                setSelectedAvatar([]);
                              }}
                            >
                              <Trash2 />
                              Remove Avatar
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
                            <span className="sr-only">Set Avatar</span>
                            Set Avatar
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-start mt-4">
                      <Button type="submit" className="bg-primary text-secondary">
                        Update Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </main>
        </div>
        <ImageManagerDialog
          title="Avatar Image"
          buttonText="Set Avatar"
          ref={dialogRef}
          tab={tab}
          selected={selectedAvatar}
          modalOpen={modalOpen}
          onTabChange={onTabChange}
          onImageSelected={onImageSelected}
          onClearSelectedImage={onClearSelectedImage}
          onSetImage={onSetAvatar}
          onCloseDialog={onCloseDialog}
        />
      </>
    );
  },
  () => <div>Loading User...</div>,
  ({ retry, error }) => (
    <div>
      <div>Failed to load User: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </div>
  ),
);

export default EditProfile;
