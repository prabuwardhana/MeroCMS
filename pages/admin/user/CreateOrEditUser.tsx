import React, { useEffect, useMemo, useState } from "react";

import { usePageContext } from "vike-react/usePageContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withFallback } from "vike-react-query";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";

import Role from "@/server/constants/role";
import { User } from "@/lib/types";
import { userFormSchema } from "@/lib/schemas";

import { RotateCcw } from "lucide-react";

import { useCreateUpdateUserMutation } from "@/hooks/api/useCreateUpdateUserMutation";
import { useGetSingleUserQuery } from "@/hooks/api/useGetSingleUserQuery";
import { PasswordInput } from "@/components/ui/password-input";

const CreateOrEditUser = withFallback(
  () => {
    const { routeParams } = usePageContext();
    const pageTitle = routeParams.id ? "Edit User" : "Add New User";

    const initialUserData = useMemo(
      () => ({
        _id: undefined,
        profile: {
          name: "",
          username: "",
        },
        role: undefined,
        email: "",
        password: "",
        verified: true,
      }),
      [],
    );

    // local states
    const [userData, setUserData] = useState<User>(initialUserData);

    const { userQuery } = useGetSingleUserQuery(routeParams.id);
    const mutation = useCreateUpdateUserMutation(routeParams.id);

    // 1. Define our form.
    const formMethods = useForm<User>({
      // Integrate zod as the schema validation library
      resolver: async (data, context, options) => {
        return zodResolver(userFormSchema)(data, context, options);
      },
      // form states
      defaultValues: {
        profile: {
          name: userData.profile.name,
          username: userData.profile.username,
        },
        email: userData.email,
        role: userData.role,
        // This is a workaround to satisfy the form schema validator.
        // In update mode, the upsert api endpoint will ignore this value.
        password: routeParams.id ? "******" : "",
        verified: userData.verified,
      },
    });

    // 2. Define the form submit handler.
    const handleSubmit: SubmitHandler<User> = (formData) => {
      // Saves the content to DB.
      mutation.mutate(formData);
    };

    // In edit mode, loads the content from DB.
    useEffect(() => {
      if (routeParams.id && userQuery) {
        const user: User = userQuery.data;
        // replace postData with the new one from the DB
        setUserData(user);
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
        profile: {
          name: userData.profile.name,
          username: userData.profile.username,
        },
        email: userData.email,
        role: userData.role,
        verified: userData.verified,
      });
    }, [reset, userData]);

    return (
      <>
        <div className="mb-6">
          <PageTitle>{pageTitle}</PageTitle>
        </div>
        <div className="flex flex-col gap-y-6 md:flex-row md:gap-x-6">
          <main className="basis-1/3">
            <Form {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
                <Card className="p-4 space-y-4">
                  <FormField
                    control={formMethods.control}
                    name="profile.name"
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
                    name="profile.username"
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
                    name="role"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <FormLabel className="text-xs font-bold uppercase text-primary">Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={Role.Admin}>Admin</SelectItem>
                            <SelectItem value={Role.Customer}>Customer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formMethods.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <FormLabel className="text-xs font-bold uppercase text-primary">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            autoComplete="email"
                            disabled={routeParams.id ? true : false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formMethods.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <FormLabel className="text-xs font-bold uppercase text-primary">Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                            disabled={routeParams.id ? true : false}
                            autoComplete="current-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formMethods.control}
                    name="verified"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked: boolean) => {
                                field.onChange(checked);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-xs font-bold uppercase text-primary mr-4">Verified</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <Button type="submit" size={"sm"} className="bg-primary text-primary-foreground">
                      {routeParams.id ? "Update User" : "Create New User"}
                    </Button>
                  </div>
                </Card>
              </form>
            </Form>
          </main>
        </div>
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

export default CreateOrEditUser;
