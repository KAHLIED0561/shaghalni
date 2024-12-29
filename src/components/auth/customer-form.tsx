"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cookies from "js-cookie";
import { ArrowLeft, Eye, EyeOff, LockKeyholeIcon, Mail, MapPin, Smartphone, UserRound } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useGetData, usePostData } from "@/hooks/useFetch";
import { useModalStore } from "@/hooks/useModalStore";

import { EMAIL_ADDRESS } from "@/constant";
import { CustomerSchema } from "@/schemas/auth/customer";
import { CitySchema } from "@/schemas/city";
import { createCustomerSchema } from "@/schemas/user";

export const CustomerForm = () => {
  const dir = useLocale() === "ar" ? "rtl" : "ltr";
  const { openModal } = useModalStore();
  const t = useTranslations("auth.register.personal_account");
  const [inputTypePassword, setInputTypePassword] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const customerSchema = createCustomerSchema({
    name: { required: t("name.validation.required"), invalid: t("name.validation.invalid") },
    email: { required: t("email.validation.required"), invalid: t("email.validation.invalid") },
    password: { required: t("password.validation.required"), invalid: t("password.validation.invalid") },
    phone: { required: t("phone.validation.required"), invalid: t("phone.validation.invalid") },
    location: { required: t("location.validation.required") },
  });
  type CustomerSchema = z.infer<typeof customerSchema>;
  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", email: "", password: "", phone: "", gender: "MALE", location: "" },
  });
  const { data } = useGetData<z.infer<typeof CitySchema>[]>({ endpoint: "/cities", config: {} });
  const cities = data?.status === "success" ? data.response : [];
  const { mutateAsync } = usePostData<z.infer<typeof CustomerSchema>>({
    endpoint: "/auth/signup/customers",
    config: { responseType: "json" },
  });
  const { isSubmitting } = form.formState;

  const handleInputTypeChange = () => {
    setInputTypePassword((prev) => !prev);
  };

  const handleFormSubmit = async (data: CustomerSchema) => {
    // Clear previous errors
    setErrors([]);

    const { name, email, password, phone, gender, location } = data;
    const formData = { name, email, password, phone, gender, city_id: location };

    // Call API with form data
    const res = await mutateAsync(formData);
    const isSuccess = res.status === "success";

    if (isSuccess) {
      cookies.set(EMAIL_ADDRESS, email);
      openModal("verifyEmail");
      return;
    }

    if (typeof res.message === "string") setErrors([res.message]);
    else setErrors(res.message);
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
              name="gender"
              render={({ field }) => {
                const isMale = field.value === "MALE";
                return (
                  <FormItem className="space-y-0">
                    <FormLabel>{t("gender.label")}</FormLabel>
                    <FormControl>
                      <RadioGroup dir={dir} onValueChange={field.onChange} defaultValue={field.value}>
                        <div className="flex items-center justify-between gap-4">
                          <FormItem className="basis-1/2">
                            <FormControl>
                              <RadioGroupItem value="MALE" className="hidden" />
                            </FormControl>
                            <FormLabel
                              className={cn(
                                "w-full py-3 px-6 border rounded-2.5xl flex items-center gap-2 transition-all *:transition-all",
                                isMale ? "bg-primaryClr-50/30 border-primaryClr-600" : "bg-[#F6FBF8]/60 border-gray-300"
                              )}
                            >
                              <span
                                className={cn(
                                  "size-4 border rounded-full flex items-center justify-center",
                                  isMale ? "border-primaryClr" : ""
                                )}
                              >
                                <span
                                  className={cn(
                                    "size-2 block rounded-full",
                                    isMale ? "bg-primaryClr" : "bg-primaryClr-50/30"
                                  )}
                                />
                              </span>
                              <span className={cn("font-semibold", isMale ? "text-primaryClr" : "text-garyClr")}>
                                {t("gender.male")}
                              </span>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="basis-1/2">
                            <FormControl>
                              <RadioGroupItem value="FEMALE" className="hidden" />
                            </FormControl>
                            <FormLabel
                              className={cn(
                                "w-full py-3 px-6 border rounded-2.5xl flex items-center gap-2 transition-all *:transition-all",
                                !isMale
                                  ? "bg-primaryClr-50/30 border-primaryClr-600"
                                  : "bg-[#F6FBF8]/60 border-gray-300"
                              )}
                            >
                              <span
                                className={cn(
                                  "size-4 border rounded-full flex items-center justify-center",
                                  !isMale ? "border-primaryClr" : ""
                                )}
                              >
                                <span
                                  className={cn(
                                    "size-2 block rounded-full",
                                    !isMale ? "bg-primaryClr" : "bg-primaryClr-50/30"
                                  )}
                                />
                              </span>
                              <span className={cn("font-semibold", !isMale ? "text-primaryClr" : "text-garyClr")}>
                                {t("gender.female")}
                              </span>
                            </FormLabel>
                          </FormItem>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("location.label")}</FormLabel>
                  <div className="relative">
                    <MapPin className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="pe-3.5">
                        <SelectTrigger dir={dir} className="px-9 bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5">
                          <SelectValue placeholder={t("location.placeholder")} />
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
