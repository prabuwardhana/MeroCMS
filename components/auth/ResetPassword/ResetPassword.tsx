import * as React from "react";

import { useMutation } from "@tanstack/react-query";
import { usePageContext } from "vike-react/usePageContext";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

import API from "@/config/apiClient";
// import ResetPasswordForm from "./ResetPasswordForm";

// Schema for password validation
const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const ResetPassword = () => {
  const { urlParsed } = usePageContext();

  const code = urlParsed.search.code;
  const exp = Number(urlParsed.search.exp);
  const now = Date.now();
  const linkIsValid = code && exp && exp > now;

  const mutation = useMutation({
    mutationFn: async (data: { verificationCode: string; password: string }) =>
      API.post("/api/auth/password/reset", data),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { password } = values;
      mutation.mutate({ verificationCode: code, password });
    } catch (error) {
      console.error("Error resetting password", error);
    }
  }

  return (
    <div className="flex min-h-[50vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Change Your Password</CardTitle>
          <CardDescription>Enter your new password to reset your password.</CardDescription>
          {mutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex items-center flex-row">
                <span>{mutation.error?.message || "An error occurred"}</span>
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          {linkIsValid ? (
            mutation.isSuccess ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex items-center flex-row">
                  Password updated successfully! Now you can <a href="/auth/login">Sign In</a>
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid gap-4">
                    {/* New Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel htmlFor="password">New Password</FormLabel>
                          <FormControl>
                            <PasswordInput id="password" placeholder="******" autoComplete="new-password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password Field */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                          <FormControl>
                            <PasswordInput
                              id="confirmPassword"
                              placeholder="******"
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Reset Password
                    </Button>
                  </div>
                </form>
              </Form>
            )
          ) : (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex items-center flex-row">Invalid Link</AlertDescription>
                <span>The link is either invalid or expired.</span>
                <a href="/auth/forgot-password">Request a new password reset link</a>
              </Alert>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
