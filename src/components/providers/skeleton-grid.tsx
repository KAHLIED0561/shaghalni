import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

export function ProvidersSectionSkeleton({ isAr = false }: { isAr?: boolean }) {
  return (
    <section className="pt-20">
      <div className="container space-y-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Skeleton className="h-9 w-64" />
          <div className="flex items-center">
            <Skeleton className="h-6 w-24 mr-2" />
            <ChevronLeft className={cn("text-muted-foreground", isAr ? "rotate-0" : "rotate-180")} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 gap-y-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="space-y-6 rounded-2.5xl border border-gray-200 bg-gray-50 shadow p-5 flex flex-col items-center"
            >
              <Skeleton className="w-full aspect-square rounded-lg" />
              <div className="w-full space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
