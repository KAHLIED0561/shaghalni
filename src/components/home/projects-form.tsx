"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseBusiness, MapPin, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { mapRequestType } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { RequestType } from "@/constant";
import { HomeSchema } from "@/schemas/home";

const FormSchema = z.object({
  project: z.string().optional(),
  location: z.string().optional(),
  service: z.string().optional(),
});

const PropsSchema = HomeSchema.pick({ location: true });
export const ProjectsForm = ({ location }: z.infer<typeof PropsSchema>) => {
  const t = useTranslations("home.hero.search");
  const router = useRouter();
  const locale = useLocale();
  const REQUEST_TYPES = Object.values(RequestType).map((type) => mapRequestType(type, locale));
  const formSchema = FormSchema;
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { project: "", location: "", service: "" },
  });
  const isSubmitting = form.formState.isSubmitting;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const onSubmit = (data: FormValues) => {
    const params = new URLSearchParams();
    if (data.project) params.append("title", data.project);
    if (data.location) params.append("locationId", data.location);
    if (data.service) params.append("service-type", data.service);
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="bg-white text-black max-w-screen-lg 4xl:max-w-screen-2xl p-6 rounded-2.5xl space-y-4 4xl:space-y-10">
      <h2 className="font-semibold text-2xl 4xl:text-5xl">{t("title")}</h2>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
              name="location"
              render={({ field }) => (
                <FormItem className="space-y-0 col-span-2 xs:col-span-1">
                  <FormLabel className="sr-only">{t("location_placeholder")}</FormLabel>
                  <div className="relative">
                    <MapPin className="absolute size-4 4xl:size-8 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
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
              name="service"
              render={({ field }) => (
                <FormItem className="space-y-0 col-span-2 xs:col-span-1">
                  <FormLabel className="sr-only">{t("service_placeholder")}</FormLabel>
                  <div className="relative">
                    <MapPin className="absolute size-4 4xl:size-8 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              )}
            />
            <Button
              type="submit"
              className="bg-primaryClr-600 text-white rounded-2.5xl transition-colors hover:bg-primaryClr-500 flex items-center justify-center gap-2 font-medium 4xl:text-2xl 4xl:py-6"
              disabled={isSubmitting}
            >
              <Search className="size-4 4xl:size-8" />
              <span>{t("search")}</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
