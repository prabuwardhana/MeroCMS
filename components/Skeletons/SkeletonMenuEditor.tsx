import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonMenuEditor = () => {
  return (
    <div className="flex flex-col flex-grow md:flex-row max-w-screen-md gap-x-6">
      <div className="basis-1/2 space-y-4">
        <Skeleton className="h-[36px] w-[150px] rounded-xl bg-card/60" />
        <Skeleton className="h-[300px] w-full rounded-xl bg-card/60" />
      </div>
      <div className="basis-1/2 space-y-4">
        <Skeleton className="h-[36px] w-[150px] rounded-xl bg-card/60" />
        <Skeleton className="h-[300px] w-full rounded-xl bg-card/60" />
      </div>
    </div>
  );
};
