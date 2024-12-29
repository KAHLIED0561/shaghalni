"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseBusiness, Building, HandPlatter, MapPin, Search, Target } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { ExpandIcon } from "@/components/icons/expand";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { HomeSchema } from "@/schemas/home";

const FormSchema = z.object({
  provider: z.string().optional(),
  city: z.string().optional(),
  serviceType: z.string().optional(),
  facilityType: z.string().optional(),
  service: z.string().optional(),
});

const Shape = HomeSchema.shape.location;
const PropsSchema = z.object({
  cities: Shape,
  serviceTypes: Shape,
  facilityTypes: Shape,
  services: Shape,
});

export const ProvidersSearch = ({ cities, serviceTypes, facilityTypes, services }: z.infer<typeof PropsSchema>) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("provider.search");
  const locale = useLocale();
  const [{ name, cityId, facilityTypeId, serviceId, serviceTypeId }, setParams] = useQueryStates({
    name: parseAsString.withDefault(""),
    cityId: parseAsString.withDefault(""),
    serviceTypeId: parseAsString.withDefault(""),
    facilityTypeId: parseAsString.withDefault(""),
    serviceId: parseAsString.withDefault(""),
  });
  type FormValues = z.infer<typeof FormSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      provider: name,
      city: cityId,
      service: serviceId,
      serviceType: serviceTypeId,
      facilityType: facilityTypeId,
    },
  });
  const isSubmitting = form.formState.isSubmitting;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const showClearBtn = isExpanded && (name || serviceTypeId || cityId || facilityTypeId || serviceId);

  const onClearFilters = () => {
    form.reset();
    setParams({ name: "", cityId: "", serviceTypeId: "", facilityTypeId: "", serviceId: "" });
  };

  const onSubmit = (data: FormValues) => {
    setParams({
      name: data.provider,
      cityId: data.city,
      serviceTypeId: data.serviceType,
      facilityTypeId: data.facilityType,
      serviceId: data.service,
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
                name="provider"
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
                name="city"
                render={({ field: { onChange, value } }) => {
                  return (
                    <FormItem className="space-y-0 col-span-2 lg:col-span-1">
                      <FormLabel className="sr-only">{t("location_placeholder")}</FormLabel>
                      <div className="relative">
                        <MapPin className="absolute size-4 4xl:size-8 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                        <Select onValueChange={onChange} key={value} defaultValue={value || ""}>
                          <FormControl>
                            <SelectTrigger
                              dir={dir}
                              className="flex items-center gap-4 ps-9 bg-[#F8F8F8] rounded-2.5xl border-none 4xl:text-2xl 4xl:ps-16 4xl:py-6"
                            >
                              <SelectValue placeholder={t("location_placeholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent dir={dir}>
                            {cities.map(({ id, option }) => (
                              <SelectItem key={id} value={id.toString()}>
                                {option}
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
                name="serviceType"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="space-y-0 col-span-2 xs:col-span-1">
                    <FormLabel className="sr-only">{t("provider_type")}</FormLabel>
                    <div className="relative">
                      <Target className="absolute size-4 4xl:size-8 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Select onValueChange={onChange} key={value} defaultValue={value}>
                        <FormControl>
                          <SelectTrigger
                            tabIndex={isExpanded ? 0 : -1}
                            dir={dir}
                            className="flex items-center gap-4 ps-9 bg-[#F8F8F8] rounded-2.5xl border-none 4xl:text-2xl 4xl:ps-16 4xl:py-6"
                          >
                            <SelectValue placeholder={t("provider_type")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir={dir}>
                          {serviceTypes.map(({ id, option }) => (
                            <SelectItem key={id} value={id.toString()}>
                              {option}
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
                name="facilityType"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="space-y-0 col-span-2 xs:col-span-1">
                    <FormLabel className="sr-only">{t("facility_type")}</FormLabel>
                    <div className="relative">
                      <Building className="absolute size-4 4xl:size-8 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Select onValueChange={onChange} key={value} defaultValue={value}>
                        <FormControl>
                          <SelectTrigger
                            tabIndex={isExpanded ? 0 : -1}
                            dir={dir}
                            className="flex items-center gap-4 ps-9 bg-[#F8F8F8] rounded-2.5xl border-none 4xl:text-2xl 4xl:ps-16 4xl:py-6"
                          >
                            <SelectValue placeholder={t("facility_type")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir={dir}>
                          {facilityTypes.map(({ id, option }) => (
                            <SelectItem key={id} value={id.toString()}>
                              {option}
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
                name="service"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="space-y-0 col-span-2 xs:col-span-1">
                    <FormLabel className="sr-only">{t("activities")}</FormLabel>
                    <div className="relative">
                      <HandPlatter className="absolute size-4 4xl:size-8 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Select onValueChange={onChange} key={value} defaultValue={value}>
                        <FormControl>
                          <SelectTrigger
                            tabIndex={isExpanded ? 0 : -1}
                            dir={dir}
                            className="flex items-center gap-4 ps-9 bg-[#F8F8F8] rounded-2.5xl border-none 4xl:text-2xl 4xl:ps-16 4xl:py-6"
                          >
                            <SelectValue placeholder={t("activities")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir={dir}>
                          {services.map(({ id, option }) => (
                            <SelectItem key={id} value={id.toString()}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="!mt-2 text-xs" />
                  </FormItem>
                )}
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
