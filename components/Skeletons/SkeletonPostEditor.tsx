import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonPostEditor = () => {
  return (
    <div className="flex-grow">
      <div className="flex flex-col gap-y-6 xl:flex-row xl:gap-x-6">
        <main className="basis-3/4 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-col justify-center md:flex-row md:justify-between">
              <Skeleton className="h-[36px] w-1/6 rounded-xl bg-card/60" />
              <div className="flex justify-between gap-x-6">
                <Skeleton className="h-[36px] w-[100px] rounded-xl bg-card/60" />
                <Skeleton className="h-[36px] w-[100px] rounded-xl bg-card/60" />
              </div>
            </div>
          </div>
          <Skeleton className="h-[48px] w-full rounded-xl bg-card/60" />
          <Skeleton className="h-[48px] w-full rounded-xl bg-card/60" />
          <Skeleton className="h-[250px] w-full rounded-xl bg-card/60" />
        </main>
        <aside className="basis-1/4">
          <Skeleton className="h-full w-full rounded-xl bg-card/60" />
        </aside>
      </div>
    </div>
  );
};
