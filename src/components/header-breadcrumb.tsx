import { MoveLeft } from "lucide-react";
import { getLocale } from "next-intl/server";
import { v4 } from "uuid";

import { cn } from "@/lib/utils";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type HeaderBreadcrumbProps = {
  itemsList: {
    link: string;
    value: string;
  }[];
};

export const HeaderBreadcrumb = async ({ itemsList }: HeaderBreadcrumbProps) => {
  const dir = (await getLocale()) === "ar" ? "rtl" : "ltr";

  return (
    <div className="bg-secondaryClr-600 py-4">
      <div className="container">
        <Breadcrumb dir={dir}>
          <BreadcrumbList>
            {itemsList.map((item, index) => {
              const isLast = index === itemsList.length - 1;
              return (
                <div key={v4()} className="flex items-center gap-2 text-base xs:text-xl">
                  <BreadcrumbItem>
                    {isLast ? (
                      <p className="text-white hover:text-white">{item.value}</p>
                    ) : (
                      <BreadcrumbLink
                        href={item.link}
                        className="text-primaryClr transition-colors hover:text-primaryClr-400"
                      >
                        {item.value}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator>
                      <MoveLeft className={cn("text-primaryClr w-10", dir === "rtl" ? "rotate-0" : "rotate-180")} />
                    </BreadcrumbSeparator>
                  )}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};
