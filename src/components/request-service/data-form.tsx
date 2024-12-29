"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { ArrowLeft, BriefcaseBusiness, CalendarRange, FolderCog, Link, MapPin, MapPinned } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createHeaders } from "@/lib/createHeaders";
import { postData } from "@/lib/request";
import { cn } from "@/lib/utils";

import { FormErrors } from "@/components/auth/form-errors";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import RemovableItem from "@/components/ui/removableItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useGetData } from "@/hooks/useFetch";

import { RequestType } from "@/constant";
import { CitySchema } from "@/schemas/city";
import { ServiceSchema } from "@/schemas/service";
import { createServiceFormSchema } from "@/schemas/service/form";

export const DataForm = () => {
  const isAr = useLocale() === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const t = useTranslations("service_req");
  const headers = createHeaders();
  const [serviceType, setServiceType] = useQueryState("type", {
    defaultValue: RequestType.TECHNICIAN,
    history: "replace",
  });
  const [, setStep] = useQueryState("step", { defaultValue: "2", history: "replace" });
  const [, setId] = useQueryState("id");
  const [errors, setErrors] = useState<string[]>([]);

  const formSchema = createServiceFormSchema({
    name: { required: t("name.required"), invalid: t("name.invalid") },
    req_activities: t("req_activities.required"),
    city: t("city.required"),
    neighborhood: t("neighborhood.required"),
    period: t("period.required"),
    location_link: { required: t("location_link.required"), invalid: t("location_link.invalid") },
    description: t("description.required"),
  });
  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      req_activities: [],
      city: "",
      neighborhood: "",
      location_link: "",
      period: "",
      description: "",
    },
  });
  const { isSubmitting } = form.formState;

  const { data: servicesData } = useGetData<z.infer<typeof ServiceSchema>[]>({ endpoint: "/services", config: {} });
  const services = servicesData?.status === "success" ? servicesData.response : [];
  const { data: citiesData } = useGetData<z.infer<typeof CitySchema>[]>({ endpoint: "/cities", config: {} });
  const cities = citiesData?.status === "success" ? citiesData.response : [];

  const handleBack = () => {
    setStep("1");
  };

  const handleFormSubmit = async (data: FormSchema) => {
    setErrors([]);
    const activities = data.req_activities
      .map((activity) => {
        // find the id of the activity
        const item = services.find((service) => service.name === activity);
        if (!item) return null;
        return item.id;
      })
      .filter((activity) => activity !== null); // remove null values

    const body = {
      ...data,
      serviceType,
      req_activities: activities, // replace the names with the ids
      city: parseInt(data.city),
    };
    type ResSchema = { id: number | string };
    const res = await postData<ResSchema>({ endpoint: "/requests", config: { headers, body } });

    if (res.status === "fail") {
      setErrors(res.message);
      return;
    }

    setStep("3");
    setId(res.response.id.toString());
    setServiceType(serviceType);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("name.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FolderCog className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                    <Input
                      type="text"
                      placeholder={t("name.placeholder")}
                      className="ps-9 bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="req_activities"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("req_activities.label")}</FormLabel>
                <div className="relative overflow-hidden">
                  <BriefcaseBusiness className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                  <Select onValueChange={(newValue) => field.onChange([...field.value, newValue])}>
                    <FormControl className="pe-3.5">
                      <>
                        <SelectTrigger
                          dir={dir}
                          className="ps-9 bg-[#F6FBF8] rounded-2.5xl justify-end border-garyClr focus:ring-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!(field.value.length > 0 && field.value) && (
                            <span className=" flex-1 text-start text-sm text-gray-500 select-none">
                              {t("req_activities.placeholder")}
                            </span>
                          )}
                        </SelectTrigger>
                        <div className="mx-8 sm:mx-9 inline-flex gap-2 items-center absolute top-0 bottom-0 max-w-[calc(100%-4rem)] hide-scrollbar sm:narrow-scrollbar overflow-y-auto">
                          {field.value.length > 0 &&
                            field.value &&
                            field.value?.map((activity) => (
                              <RemovableItem
                                key={activity}
                                size="sm"
                                value={activity}
                                onRemove={(value) => {
                                  console.log("value", value);
                                  field.onChange(field.value.filter((v) => v !== value));
                                }}
                              />
                            ))}
                        </div>
                      </>
                    </FormControl>
                    <SelectContent dir={dir}>
                      {services.map((service) => (
                        <SelectItem
                          key={service.id}
                          value={service.name}
                          disabled={field.value?.includes(service.name)}
                        >
                          {service.name}
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("city.label")}</FormLabel>
                <div className="relative">
                  <MapPin className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="pe-3.5">
                      <SelectTrigger dir={dir} className="px-9 bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5">
                        <SelectValue placeholder={t("city.placeholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent dir={dir}>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
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
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("neighborhood.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPinned className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                    <Input
                      type="text"
                      placeholder={t("neighborhood.placeholder")}
                      className="ps-9 bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("location_link.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Link className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                    <Input
                      type="text"
                      placeholder={t("location_link.placeholder")}
                      className="ps-9 bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-4">
                <FormLabel className="pt-1">{t("period.label")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn(
                          "w-full bg-[#F6FBF8] rounded-2.5xl border border-garyClr py-5 text-start font-normal hover:bg-[#F6FBF8] flex justify-start gap-2",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarRange className="size-4 text-muted-foreground" />
                        {field.value ? (
                          <span className="text-black">{format(field.value, "PPP")}</span>
                        ) : (
                          <span>{t("period.placeholder")}</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit flex justify-center p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value)}
                      onSelect={(val) => {
                        const stringVal = val?.toString();
                        field.onChange(stringVal);
                      }}
                      disabled={(date) =>
                        date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 6))
                      }
                      initialFocus
                      locale={isAr ? arSA : enUS}
                      className="bg-white border border-gray-300 rounded-md shadow-md"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="-translate-y-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("description.label")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("description.placeholder")}
                    className="resize-none bg-[#F6FBF8] border border-garyClr rounded-2.5xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormErrors errors={errors} />
          </div>
        </div>
        <div className="flex items-end">
          <div className="flex basis-full justify-end">
            <Button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 bg-transparent text-primaryClr hover:underline hover:underline-offset-4 hover:bg-transparent"
            >
              <ArrowLeft className={cn("size-4", dir === "rtl" ? "rotate-180" : "rotate-0")} />
              <span>{t("previous")}</span>
            </Button>
            <Button
              type="submit"
              className="w-fit px-6 py-4 bg-primaryClr-600 rounded-2.5xl hover:bg-primaryClr-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("is_loading") : t("next")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
