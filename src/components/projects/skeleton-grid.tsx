import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsSectionSkeleton({ isAr = false, withHeader = true }: { isAr?: boolean; withHeader?: boolean }) {
  return (
    <section className={withHeader ? "pt-20" : ""}>
      <div className="container space-y-8">
        {withHeader && (
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Skeleton className="h-9 w-64" />
            <div className="flex items-center">
              <Skeleton className="h-6 w-24 mr-2" />
              <ChevronLeft className={cn("text-muted-foreground", isAr ? "rotate-0" : "rotate-180")} />
            </div>
          </div>
        )}
        <div className="space-y-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="rounded-2.5xl border border-gray-200 bg-gray-50 shadow flex flex-col sm:flex-row gap-2"
            >
              <div className="w-full sm:w-auto h-full p-4">
                <Skeleton className="rounded-2xl w-full h-[200px] sm:size-[200px]" />
              </div>
              <div className="px-4 pb-4 sm:py-6 flex-1 flex flex-col md:justify-center space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:basis-1/2 flex-1 space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                  <div className="md:basis-1/2 space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
