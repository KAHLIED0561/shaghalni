"use client";

import { useLocale } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PagePagination({ numberOfPages }: { numberOfPages: number }) {
  const dir = useLocale() === "ar" ? "rtl" : "ltr";
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page") ?? 1);
  const isNextDisabled = currentPage === numberOfPages;
  const isPreviousDisabled = currentPage === 1;

  const pagesSubset = () => {
    if (numberOfPages <= 5) {
      return Array.from({ length: numberOfPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }
    if (currentPage >= numberOfPages - 2) {
      return [numberOfPages - 4, numberOfPages - 3, numberOfPages - 2, numberOfPages - 1, numberOfPages];
    }
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  return (
    <Pagination dir={dir} className=" bg-lightBackground border border-lightBorderClr rounded-2xl p-2 px-3 w-min">
      <PaginationContent dir={dir} className=" gap-1">
        {!isPreviousDisabled && (
          <PaginationItem>
            <PaginationPrevious
              className={cn("rounded-full", dir === "ltr" ? "" : "rotate-180")}
              href={`${pathname}?page=${currentPage - 1}`}
            />
          </PaginationItem>
        )}
        {pagesSubset().map((i) => (
          <PaginationItem key={i}>
            <PaginationLink isActive={currentPage === i} className=" rounded-full" href={` ${pathname}?page=${i}`}>
              {i}
            </PaginationLink>
          </PaginationItem>
        ))}
        {!isNextDisabled && (
          <PaginationItem>
            <PaginationNext
              className={cn("rounded-full", dir === "ltr" ? "" : "rotate-180")}
              href={`${pathname}?page=${currentPage + 1}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
