import React, { useEffect, useMemo, useState } from "react";

import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePageContext } from "vike-react/usePageContext";
import { withFallback } from "vike-react-query";

import ImageManagerDialog from "@/components/admin/Dialogs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useUserProfileStore } from "@/store/userProfileStore";
import { useProfiles } from "@/hooks/api/useProfiles";
import { CloudinaryResourceType, UserProfile } from "@/lib/types";
import { profileFormSchema } from "@/lib/schemas";

import { RotateCcw, Trash2 } from "lucide-react";

const EditProfile = withFallback(
  () => {
    const { user } = usePageContext();

    // global states
    const { userProfile, setUserProfile } = useUserProfileStore((state) => state);

    // local states
    const [tab, setTab] = useState("gallery");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<Array<CloudinaryResourceType>>([]);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>("");

    const { upsertMutation } = useProfiles();

    // 1. Define our form.
    const formMethods = useForm<UserProfile>({
      // Integrate zod as the schema validation library
      resolver: async (data, context, options) => {
        return zodResolver(profileFormSchema)(data, context, options);
      },
      // form states
      defaultValues: {
        name: userProfile.name,
        username: userProfile.username,
        biography: userProfile.biography,
        avatarUrl: userProfile.avatarUrl,
      },
    });

    // 2. Define the form submit handler.
    const handleSubmit: SubmitHandler<UserProfile> = (formData) => {
      // Saves the content to DB.
      upsertMutation.mutate(formData);
    };

    const handleSubmitError: SubmitErrorHandler<UserProfile> = (formData) => {
      console.log(formData);
    };

    // Get the user from the page context provided by Vike.
    useEffect(() => {
      if (user) {
        const profile: UserProfile = user.profile;
        // replace postData with the new one from the DB
        setUserProfile(profile);
        setAvatarUrl(profile.avatarUrl);
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
        name: userProfile.name,
        username: userProfile.username,
        biography: userProfile.biography,
        avatarUrl: userProfile.avatarUrl,
      });
    }, [reset, userProfile]);

    useEffect(() => {
      if (selectedAvatar.length) formMethods.setValue("avatarUrl", selectedAvatar[0].secure_url);
    }, [selectedAvatar]);

    const onTabChange = (value: string) => {
      setTab(value);
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
      setAvatarUrl(selectedAvatar[0].secure_url);
      formMethods.setValue("avatarUrl", selectedAvatar[0].secure_url);
      setIsDialogOpen(false);
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

                        {avatarUrl ? (
                          <>
                            <img src={avatarUrl} className="h-48 w-full object-cover rounded-md" />
                            <Button
                              type="button"
                              variant="link"
                              className="p-0 flex justify-center items-center text-sm text-destructive"
                              onClick={() => {
                                setAvatarUrl("");
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
                            size={"sm"}
                            onClick={() => setIsDialogOpen(true)}
                            className="h-20 w-full text-wrap rounded-sm border border-dashed border-gray-600 bg-gray-100 text-sm text-secondary-foreground transition-colors hover:bg-gray-300"
                          >
                            <span className="sr-only">Set Avatar</span>
                            Set Avatar
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-start mt-4">
                      <Button type="submit" className="bg-primary text-primary-foreground">
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
          tab={tab}
          selected={selectedAvatar}
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onTabChange={onTabChange}
          onImageSelected={onImageSelected}
          onClearSelectedImage={onClearSelectedImage}
          onSetImage={onSetAvatar}
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
