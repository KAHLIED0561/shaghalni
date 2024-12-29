"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cookies from "js-cookie";
import { Eye, EyeOff, LockKeyholeIcon, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormErrors } from "@/components/auth/form-errors";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { usePostData } from "@/hooks/useFetch";
import { useModalStore } from "@/hooks/useModalStore";

import { loginAction } from "@/actions/login";
import { EMAIL_ADDRESS } from "@/constant";
import { loginErrorSchema, loginSuccessSchema } from "@/schemas/auth/login";

type LoginSuccess = z.infer<typeof loginSuccessSchema>;
type LoginError = z.infer<typeof loginErrorSchema>;
type ValidationMessages = {
  email: {
    required: string;
    invalid: string;
  };
  password: {
    required: string;
  };
  rememberMe: boolean;
};

const createLoginSchema = (messages: ValidationMessages) =>
  z.object({
    email: z.string().email({ message: messages.email.invalid }).min(1, { message: messages.email.required }),
    password: z.string().min(1, { message: messages.password.required }),
    rememberMe: z.boolean(),
  });

export const SignInForm = () => {
  const t = useTranslations("auth.signin");
  const searchParams = useSearchParams();
  const { openModal } = useModalStore();
  const [inputTypePassword, setInputTypePassword] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const loginSchema = createLoginSchema({
    email: { required: t("email.validation.required"), invalid: t("email.validation.invalid") },
    password: { required: t("password.validation.required") },
    rememberMe: false,
  });
  type LoginSchema = z.infer<typeof loginSchema>;
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });
  const { mutateAsync } = usePostData<LoginSuccess, LoginError>({ endpoint: "/auth/login" });
  const { isSubmitting } = form.formState;

  const handleInputTypeChange = () => {
    setInputTypePassword((prev) => !prev);
  };

  const handleFormSubmit = async (data: LoginSchema) => {
    setErrors([]);
    const res = await mutateAsync({ ...data });
    const isSuccess = res.status === "success";

    if (isSuccess) {
      const { token } = res.response;
      await loginAction(token, data.rememberMe, searchParams.get("callbackUrl"));
      return;
    }

    if (res.fail && res.fail.needToVerify) {
      cookies.set(EMAIL_ADDRESS, data.email);
      openModal("verifyEmail");
      return;
    }

    if (typeof res.message === "string") setErrors([res.message]);
    else setErrors(res.message);
  };

  return (
    <div className="mt-4 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="space-y-4">
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
            <FormErrors errors={errors} />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-gray-400" />
                    </FormControl>
                    <FormLabel className="text-garyClr -translate-y-[0.2rem]">{t("remember_me")}</FormLabel>
                  </FormItem>
                )}
              />
              <Link href="/forgot-password" className="text-primaryClr font-medium hover:underline">
                {t("forgot_password")}
              </Link>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-primaryClr-600 rounded-2.5xl hover:bg-primaryClr-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("is_loading") : t("login")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div>
        <p className="text-center text-garyClr">
          {t("no_account")}{" "}
          <Link href="/register" className="text-primaryClr font-medium hover:underline">
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
};
