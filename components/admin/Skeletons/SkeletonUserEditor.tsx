import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const SkeletonUserEditor = () => {
  return (
    <>
      <div className="mb-6">
        <Skeleton className="h-[36px] w-[200px] rounded-xl bg-card/60" />
      </div>
      <div className="flex flex-col gap-y-6 md:flex-row md:gap-x-6">
        <main className="basis-1/3">
          <Card className="p-4 space-y-6 bg-card/60">
            <div className="space-y-2">
              <Skeleton className="h-[16px] w-1/3 rounded-md" />
              <Skeleton className="h-[48px] w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-[16px] w-1/3 rounded-md" />
              <Skeleton className="h-[48px] w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-[16px] w-1/3 rounded-md" />
              <Skeleton className="h-[48px] w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-[16px] w-1/3 rounded-md" />
              <Skeleton className="h-[48px] w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-[16px] w-1/3 rounded-md" />
              <Skeleton className="h-[48px] w-full rounded-md" />
            </div>

            <div className="flex justify-between">
              <Skeleton className="h-[36px] w-1/4 rounded-md" />
            </div>
          </Card>
        </main>
      </div>
    </>
  );
};
