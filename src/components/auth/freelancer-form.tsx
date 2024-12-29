"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cookies from "js-cookie";
import {
  ArrowLeft,
  BookOpen,
  BriefcaseBusiness,
  CloudUpload,
  Eye,
  EyeOff,
  IdCard,
  LockKeyholeIcon,
  Mail,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { FormErrors } from "@/components/auth/form-errors";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RemovableItem from "@/components/ui/removableItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useGetData } from "@/hooks/useFetch";
import { useModalStore } from "@/hooks/useModalStore";

import { EMAIL_ADDRESS } from "@/constant";
import { ServiceSchema } from "@/schemas/service";
import { createFreelancerSchema } from "@/schemas/user";

export const FreelancerForm = () => {
  const dir = useLocale() === "ar" ? "rtl" : "ltr";
  const { openModal } = useModalStore();
  const t = useTranslations("auth.register.freelancer");
  const [inputTypePassword, setInputTypePassword] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const freelancerSchema = createFreelancerSchema({
    name: { required: t("name.validation.required"), invalid: t("name.validation.invalid") },
    email: { required: t("email.validation.required"), invalid: t("email.validation.invalid") },
    password: { required: t("password.validation.required"), invalid: t("password.validation.invalid") },
    phone: { required: t("phone.validation.required"), invalid: t("phone.validation.invalid") },
    activities: { required: t("activities.validation.required") },
    identityNumber: { required: t("national_id.validation.required") },
    description: { required: t("description.validation.required") },
    image: {
      required: t("personal_image.validation.required"),
      size: t("personal_image.validation.size"),
      type: t("personal_image.validation.type"),
    },
  }).pick({
    name: true,
    email: true,
    password: true,
    phone: true,
    activities: true,
    identityNumber: true,
    description: true,
    image: true,
  });
  type FreelancerSchema = z.infer<typeof freelancerSchema>;
  const form = useForm<FreelancerSchema>({
    resolver: zodResolver(freelancerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      activities: [],
      identityNumber: "",
      description: "",
      image: undefined,
    },
  });
  const { data } = useGetData<z.infer<typeof ServiceSchema>[]>({ endpoint: "/services", config: {} });
  const services = data?.status === "success" ? data.response : [];
  const { isSubmitting } = form.formState;

  const findService = (name: string) => {
    const service = services.find((service) => service.name === name);
    return service?.id.toString();
  };

  const handleInputTypeChange = () => {
    setInputTypePassword((prev) => !prev);
  };

  const handleFormSubmit = async (data: FreelancerSchema) => {
    setErrors([]);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);
    formData.append(
      "services",
      JSON.stringify(data.activities.map((activity) => parseInt(findService(activity) as string)))
    ); // Send services as JSON string array
    formData.append("identity_number", data.identityNumber);
    formData.append("about", data.description);
    formData.append("image", data.image as Blob);

    try {
      const response = await fetch("https://api.shaghalni.sa/auth/signup/freelancers", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        cookies.set(EMAIL_ADDRESS, data.email);
        openModal("verifyEmail");
        return;
      } else {
        if (typeof result.message === "string") setErrors([result.message]);
        else setErrors(result.message);
      }
    } catch (error) {
      setErrors([t("something_wrong")]);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 lg:gap-x-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name.label")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserRound className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email.label")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Input
                        type="email"
                        placeholder={t("email.placeholder")}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password.label")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LockKeyholeIcon className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Input
                        type={inputTypePassword ? "password" : "text"}
                        placeholder={t("password.placeholder")}
                        className="px-9 bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5"
                        disabled={isSubmitting}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={handleInputTypeChange}
                        className="absolute end-3.5 top-1/2 -translate-y-1/2"
                      >
                        {inputTypePassword ? (
                          <Eye className="size-4 text-garyClr" />
                        ) : (
                          <EyeOff className="size-4 text-garyClr" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone.label")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Smartphone className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Input
                        type="number"
                        placeholder={t("phone.placeholder")}
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
              name="activities"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>{t("activities.label")}</FormLabel>
                  <div className="relative overflow-hidden">
                    <BriefcaseBusiness className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr focus:ring-0" />
                    <Select onValueChange={(newValue) => field.onChange([...field.value, newValue])}>
                      <FormControl className="pe-3.5">
                        <>
                          <SelectTrigger
                            dir={dir}
                            className="ps-9 bg-[#F6FBF8] rounded-2.5xl justify-end border-garyClr"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {!(field.value.length > 0 && field.value) && (
                              <span className=" flex-1 text-start text-sm text-gray-500 select-none">
                                {t("activities.placeholder")}
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
              name="identityNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("national_id.label")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IdCard className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Input
                        type="text"
                        placeholder={t("national_id.placeholder")}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description.label")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <BookOpen className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Input
                        type="text"
                        placeholder={t("description.placeholder")}
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
              name="image"
              render={({ field: { onChange, value, ...rest } }) => {
                return (
                  <FormItem>
                    <FormLabel>{t("personal_image.label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="file"
                          multiple={false}
                          accept="image/*"
                          placeholder={t("personal_image.placeholder")}
                          className="opacity-0 py-5 w-full"
                          title=""
                          disabled={isSubmitting}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                          {...rest}
                        />
                        <span className="absolute inset-0 transform text-sm bg-[#F6FBF8] text-primaryClr pointer-events-none flex items-center justify-center gap-2 rounded-2.5xl border border-primaryClr">
                          <CloudUpload className="size-4" />
                          {value ? value.name : t("personal_image.placeholder")}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {errors.length > 0 ? <FormErrors errors={errors} /> : <div />}
            <div className="flex justify-end h-fit gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 text-primaryClr hover:underline hover:underline-offset-4"
              >
                <ArrowLeft className={cn("size-4", dir === "rtl" ? "rotate-180" : "rotate-0")} />
                <span>{t("previus")}</span>
              </Link>
              <Button
                type="submit"
                className="w-fit px-6 py-4 bg-primaryClr-600 rounded-2.5xl hover:bg-primaryClr-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("is_loading") : t("register")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
