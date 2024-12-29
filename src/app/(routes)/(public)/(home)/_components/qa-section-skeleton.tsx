import { cn } from "@/lib/utils";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

export function QaSectionSkeleton() {
  return (
    <section className="py-20 container space-y-6">
      <Skeleton className="h-12 w-3/4 max-w-lg" />
      <div className="flex justify-between gap-8">
        <div className="rounded-2.5xl border border-gray-200 bg-gray-50 shadow flex-1 h-fit container py-4">
          <Accordion type="single" collapsible>
            {[...Array(5)].map((_, idx) => (
              <AccordionItem key={idx} value={`${idx}`} className={cn("text-start", idx === 4 ? "border-b-0" : "")}>
                <AccordionTrigger className="font-medium text-lg xs:text-xl hover:no-underline text-start">
                  <Skeleton className="h-6 w-full" />
                </AccordionTrigger>
                <AccordionContent>
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="hidden lg:block">
          <Skeleton className="w-[400px] h-[400px] rounded-2.5xl" />
        </div>
      </div>
    </section>
  );
}
