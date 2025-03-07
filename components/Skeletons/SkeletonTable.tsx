import React from "react";
import { cn } from "@/core/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkeletonTableProps {
  className?: string;
}

export const SkeletonTable = ({ className }: SkeletonTableProps) => {
  return (
    <Card className={cn("flex-grow bg-card/60", className)}>
      <CardHeader>
        <CardTitle className="flex gap-4">
          <Skeleton className="h-[36px] w-1/6 rounded-xl" />
          <Skeleton className="h-[36px] w-1/6 rounded-xl" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-[36px] w-1/5 rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="flex justify-between">
          <Skeleton className="h-[36px] w-1/5 rounded-xl" />
          <Skeleton className="h-[36px] w-1/3 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
};
