import React from "react";
import { usePageContext } from "vike-react/usePageContext";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Page() {
  const { is404, abortReason } = usePageContext();
  if (is404) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>404 Page Not Found</AlertTitle>
        <AlertDescription>This page could not be found.</AlertDescription>
      </Alert>
    );
  }
  return abortReason ? (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{abortReason as string}</AlertTitle>
      <AlertDescription>{abortReason as string}</AlertDescription>
    </Alert>
  ) : (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>500 Internal Server Error</AlertTitle>
      <AlertDescription>Something went wrong.</AlertDescription>
    </Alert>
  );
}
