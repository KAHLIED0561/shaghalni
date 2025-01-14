"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserRound, UserSearch } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { FormErrors } from "@/components/auth/form-errors";
import { WorkerIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ValidationMessages = {
  providerType: string;
  privcyPolicy: string;
};

const createRegisterSchema = (messages: ValidationMessages) =>
  z
    .object({
      accountType: z.enum(["CUSTOMER", "PROVIDER"]),
      provider: z.enum(["FREELANCER", "OFFICE", "CONTRACTOR"]).optional(),
      privcyPolicy: z.boolean().refine((value) => value, { message: messages.privcyPolicy }),
    })
    .refine(
      (data) => {
        if (data.accountType === "PROVIDER" && !data.provider) return false;
        return true;
      },
      { message: messages.providerType, path: ["provider"] }
    );

export const RegisterForm = () => {
  const dir = useLocale() === "ar" ? "rtl" : "ltr";
  const router = useRouter();
  const t = useTranslations("auth.register");
  const [errors, setErrors] = useState<string[]>([]);
  const registerSchema = createRegisterSchema({
    providerType: t("provider_type.required"),
    privcyPolicy: t("privacy_policy.need_accept"),
  });
  type RegisterSchema = z.infer<typeof registerSchema>;
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { accountType: "CUSTOMER", provider: undefined, privcyPolicy: false },
  });
  const { isSubmitting } = form.formState;
  const isProvider = form.watch("accountType") === "PROVIDER";

  const prefetchRoute = (path: string) => {
    router.prefetch(path);
  };

  const handleFormSubmit = (data: RegisterSchema) => {
    setErrors([]);

    const { accountType, provider } = data;
    if (accountType === "CUSTOMER") {
      router.push("/sign-up/customer");
      return;
    }

    if (!provider) {
      setErrors([t("something_wrong")]);
      return;
    }

    const path = accountType.toLocaleLowerCase() + `/${provider.toLocaleLowerCase()}`;
    router.push(`/sign-up/${path}`);
  };

  return (
    <div className="mt-4 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => {
                const isCustomer = field.value === "CUSTOMER";
                return (
                  <FormItem>
                    <FormLabel>{t("account_type")}</FormLabel>
                    <FormControl>
                      <RadioGroup dir={dir} onValueChange={field.onChange} defaultValue={field.value}>
                        <div className="flex items-center justify-between gap-4">
                          <FormItem
                            className="basis-1/2"
                            onMouseEnter={() => {
                              prefetchRoute("/sign-up/customer");
                            }}
                          >
                            <FormControl>
                              <RadioGroupItem value="CUSTOMER" className="hidden" />
                            </FormControl>
                            <FormLabel
                              className={cn(
                                "w-full py-8 px-4 border rounded-2.5xl flex flex-col items-center gap-4 transition-all",
                                isCustomer
                                  ? "bg-primaryClr-50/30 border-primaryClr-600"
                                  : "bg-[#F6FBF8]/60 border-gray-300"
                              )}
                            >
                              <UserRound
                                className={cn("size-12 stroke-[1px]", isCustomer ? "text-primaryClr" : "text-garyClr")}
                              />
                              <span className={cn("font-semibold", isCustomer ? "text-primaryClr" : "text-garyClr")}>
                                {t("personal")}
                              </span>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="basis-1/2">
                            <FormControl>
                              <RadioGroupItem value="PROVIDER" className="hidden" />
                            </FormControl>
                            <FormLabel
                              className={cn(
                                "w-full py-8 px-4 border rounded-2.5xl flex flex-col items-center gap-4 transition-all",
                                !isCustomer
                                  ? "bg-primaryClr-50/30 border-primaryClr-600"
                                  : "bg-[#F6FBF8]/60 border-gray-300"
                              )}
                            >
                              <WorkerIcon
                                className="size-12"
                                fill={{ className: !isCustomer ? "fill-primaryClr" : "fill-garyClr" }}
                              />
                              <span className={cn("font-semibold", !isCustomer ? "text-primaryClr" : "text-garyClr")}>
                                {t("provider")}
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
            {isProvider && (
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem className="space-y-0 col-span-2 xs:col-span-1">
                    <FormLabel className="sr-only">{t("provider_type.label")}</FormLabel>
                    <div className="relative">
                      <UserSearch className="absolute size-4 4xl:size-8 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger
                            dir={dir}
                            className="flex items-center gap-4 ps-9 bg-[#F8F8F8] rounded-2.5xl border-none 4xl:text-2xl 4xl:ps-16 py-5 4xl:py-6 "
                          >
                            <SelectValue placeholder={t("provider_type.placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir={dir}>
                          <SelectItem value="FREELANCER" onMouseEnter={() => prefetchRoute("/sign-up/freelancer")}>
                            {t("provider_type.freelancer")}
                          </SelectItem>
                          <SelectItem value="OFFICE" onMouseEnter={() => prefetchRoute("/sign-up/office")}>
                            {t("provider_type.engineering_office")}
                          </SelectItem>
                          <SelectItem value="CONTRACTOR" onMouseEnter={() => prefetchRoute("/sign-up/contractor")}>
                            {t("provider_type.contractor")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="!mt-2 text-xs" />
                  </FormItem>
                )}
              />
            )}
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="privcyPolicy"
                render={({ field }) => (
                  <FormItem
                    onMouseEnter={() => {
                      const isCustomer = form.watch("accountType") === "CUSTOMER";
                      const provider = form.watch("provider")?.toLowerCase() || "freelancer";
                      const path = isCustomer ? "/sign-up/customer" : `/sign-up/${provider}`;
                      prefetchRoute(path);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-gray-400" />
                      </FormControl>
                      <FormLabel className="text-garyClr -translate-y-[0.2rem]">
                        <span>{t("privacy_policy.aggree")}</span>{" "}
                        <Link
                          href="/terms-conditions"
                          target="_blank"
                          className="text-primaryClr font-medium hover:underline"
                        >
                          <span>{t("privacy_policy.terms")}</span>
                        </Link>
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormErrors errors={errors} />
            <div>
              <Button
                type="submit"
                className="w-full bg-primaryClr-600 rounded-2.5xl hover:bg-primaryClr-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("is_loading") : t("next_btn")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div>
        <p className="text-center text-garyClr">
          {t("have_account")}{" "}
          <Link href="/sign-in" className="text-primaryClr font-medium hover:underline">
            {t("signin")}
          </Link>
        </p>
      </div>
    </div>
  );
};
