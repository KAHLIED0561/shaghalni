"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfDay, subMonths } from "date-fns";
import { BriefcaseBusiness, CalendarRange, MapPin, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn, mapRequestType } from "@/lib/utils";

import { StatusIcon } from "@/components/icons";
import { ExpandIcon } from "@/components/icons/expand";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { RequestType } from "@/constant";
import { HomeSchema } from "@/schemas/home";

const FormSchema = z.object({
  project: z.string().optional(),
  location: z.string().optional(),
  service: z.string().optional(),
  status: z.string().optional(),
  publishDate: z.union([z.date(), z.string()]).optional(),
});

const PropsSchema = z.object({
  location: HomeSchema.shape.location,
  status: z.array(z.object({ id: z.string(), key: z.string(), value: z.string() })),
});
export const ProjectsSearch = ({ location, status }: z.infer<typeof PropsSchema>) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("projects.search");
  const locale = useLocale();
  const REQUEST_TYPES = Object.values(RequestType).map((type) => mapRequestType(type, locale));
  const [{ title, "service-type": serviceType, locationId, status: searchStatus, publishDate: startDate }, setParams] =
    useQueryStates({
      title: parseAsString.withDefault(""),
      "service-type": parseAsString.withDefault(""),
      locationId: parseAsString.withDefault(""),
      status: parseAsString.withDefault(""),
      publishDate: parseAsString.withDefault(""),
    });
  type FormValues = z.infer<typeof FormSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      project: title,
      location: locationId,
      service: serviceType,
      status: searchStatus,
      publishDate: startDate ? new Date(startDate) : undefined,
    },
  });
  const isSubmitting = form.formState.isSubmitting;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const showClearBtn = isExpanded && (title || serviceType || locationId || searchStatus || startDate);

  const onClearFilters = () => {
    form.reset();
    setParams({ title: "", locationId: "", "service-type": "", status: "", publishDate: "" });
  };

  const onSubmit = (data: FormValues) => {
    setParams({
      title: data.project,
      locationId: data.location,
      "service-type": data.service,
      status: data.status,
      publishDate: data.publishDate ? data.publishDate.toString() : null,
    });
  };

  return (
    <div
      className={cn(
        "z-30 bg-white text-black max-w-screen-lg 4xl:max-w-screen-2xl p-6 rounded-2.5xl space-y-4 4xl:space-y-10 shadow-custom flex-1 overflow-hidden transition-[max-height] duration-300",
        isExpanded ? "max-h-screen" : " max-h-20"
      )}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 gap-y-6">
          <div className="flex-1 grid gap-2 gap-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem className="col-span-2 space-y-0">
                    <FormLabel className="sr-only">{t("name_placeholder")}</FormLabel>
                    <div className="relative">
                      <BriefcaseBusiness className="absolute size-4 4xl:size-8 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Input
                        type="text"
                        placeholder={t("name_placeholder")}
                        className="ps-9 bg-[#F8F8F8] rounded-2.5xl border-none 4xl:text-2xl 4xl:ps-16 4xl:py-6"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </div>
                    <FormMessage className="!mt-2 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="service"
                render={({ field: { onChange, value } }) => {
                  return (
                    <FormItem className="space-y-0 col-span-2 lg:col-span-1">
                      <FormLabel className="sr-only">{t("service_placeholder")}</FormLabel>
                      <div className="relative">
                        <BriefcaseBusiness className="absolute size-4 4xl:size-8 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                        <Select onValueChange={onChange} key={value} defaultValue={value || ""}>
                          <FormControl>
                            <SelectTrigger
                              dir={dir}
                              className="flex items-center gap-4 ps-9 bg-[#F8F8F8] rounded-2.5xl border-none 4xl:text-2xl 4xl:ps-16 4xl:py-6"
                            >
                              <SelectValue placeholder={t("service_placeholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent dir={dir}>
                            {REQUEST_TYPES.map(({ key, value }) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage className="!mt-2 text-xs" />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div
              aria-expanded={isExpanded}
              aria-hidden={!isExpanded}
              className={cn(
                " grid sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ",
                isExpanded ? " opacity-100 " : " opacity-0 delay-300 duration-0 pointer-events-none"
              )}
            >
              <FormField
                control={form.control}
                name="location"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="space-y-0 col-span-2 xs:col-span-1">
                    <FormLabel className="sr-only">{t("location_placeholder")}</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute size-4 4xl:size-8 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Select onValueChange={onChange} key={value} defaultValue={value}>
                        <FormControl>
                          <SelectTrigger
                            tabIndex={isExpanded ? 0 : -1}
                            dir={dir}
                            className="flex items-center gap-4 ps-9 bg-[#F8F8F8] rounded-2.5xl border-none 4xl:text-2xl 4xl:ps-16 4xl:py-6"
                          >
                            <SelectValue placeholder={t("location_placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir={dir}>
                          {location.map((city) => (
                            <SelectItem key={city.id} value={city.id.toString()}>
                              {city.option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="!mt-2 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="space-y-0 col-span-2 xs:col-span-1">
                    <FormLabel className="sr-only">{t("status_placeholder")}</FormLabel>
                    <div className="relative">
                      <StatusIcon
                        fill={{ className: "fill-garyClr" }}
                        className="absolute size-4 4xl:size-8 start-3.5 top-1/2 -translate-y-1/2 "
                      />
                      <Select onValueChange={onChange} key={value} defaultValue={value}>
                        <FormControl>
                          <SelectTrigger
                            tabIndex={isExpanded ? 0 : -1}
                            dir={dir}
                            className="flex items-center gap-4 ps-9 bg-[#F8F8F8] rounded-2.5xl border-none 4xl:text-2xl 4xl:ps-16 4xl:py-6"
                          >
                            <SelectValue placeholder={t("status_placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir={dir}>
                          {status.map((state) => (
                            <SelectItem key={state.id} value={state.key}>
                              {state.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="!mt-2 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publishDate"
                render={({ field: { onChange, value } }) => {
                  // Calculate dates
                  const today = startOfDay(new Date());
                  const oneMonthAgo = subMonths(today, 1);
                  const threeMonthsAgo = subMonths(today, 4);

                  return (
                    <FormItem className="space-y-0 col-span-2 xs:col-span-1">
                      <FormLabel className="sr-only w-0 h-0 overflow-hidden">{t("publish_date_placeholder")}</FormLabel>
                      <Popover>
                        <PopoverTrigger className="bg-[#F8F8F8] rounded-2.5xl border-none" asChild>
                          <FormControl>
                            <Button
                              className={cn(
                                "w-full bg-[#F8F8F8] rounded-2.5xl border border-garyClr py-5 text-start font-normal hover:bg-[#F6FBF8] flex justify-start gap-2",
                                !value && "text-muted-foreground"
                              )}
                            >
                              <CalendarRange className="size-4 text-garyClr" />
                              {value ? (
                                <span className="text-black">{format(value, "PPP")}</span>
                              ) : (
                                <span>{t("publish_date_placeholder")}</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit flex justify-center p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={value as any}
                            onSelect={(val) => {
                              const stringVal = val?.toString();
                              onChange(stringVal);
                            }}
                            disabled={(date) => date > today || date < threeMonthsAgo}
                            initialFocus
                            defaultMonth={oneMonthAgo}
                            className="bg-white border border-gray-300 rounded-md shadow-md"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="-translate-y-2" />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          <div className="flex flex-wrap xs:flex-nowrap xs:flex-col gap-4">
            <div className="flex xs:items-center gap-2">
              <Button type="submit" className="gap-2" disabled={isSubmitting}>
                <Search className="size-4 4xl:size-8" />
                <span className=" hidden sm:inline">{t("search")}</span>
              </Button>
              <Button
                className="px-3"
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                <ExpandIcon className={cn("size-4 4xl:size-8 transition-transform ", isExpanded ? "" : "rotate-180")} />
                <span className=" sr-only">{t("expand")}</span>
              </Button>
            </div>
            {showClearBtn && (
              <div>
                <Button
                  type="button"
                  variant={"ghost"}
                  className="px-3 rounded-2.5xl"
                  disabled={isSubmitting}
                  onClick={onClearFilters}
                >
                  {t("clear")}
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
