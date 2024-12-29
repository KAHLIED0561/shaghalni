"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cookies from "js-cookie";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormErrors } from "@/components/auth/form-errors";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { usePostData } from "@/hooks/useFetch";

import { EMAIL_ADDRESS } from "@/constant";

type ValidationMessages = {
  email: {
    required: string;
    invalid: string;
  };
};

const createForgotPasswordSchema = (messages: ValidationMessages) =>
  z.object({
    email: z.string().email({ message: messages.email.invalid }).min(1, { message: messages.email.required }),
  });

export const ForgotPasswordForm = () => {
  const t = useTranslations("auth.forgot_password");
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const forgotPasswordSchema = createForgotPasswordSchema({
    email: { required: t("email.validation.required"), invalid: t("email.validation.invalid") },
  });
  type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const { mutateAsync } = usePostData({ endpoint: "/auth/forget-password" });
  const { isSubmitting } = form.formState;

  const preFetchOtp = useCallback(() => {
    router.prefetch("/verify-otp");
  }, [router]);

  const handleFormSubmit = async (data: ForgotPasswordSchema) => {
    setErrors([]);
    const res = await mutateAsync(data);
    if (res.status === "success") {
      cookies.set(EMAIL_ADDRESS, data.email);
      router.push("/verify-otp");
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
                        onMouseEnter={preFetchOtp}
                        onPaste={preFetchOtp}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormErrors errors={errors} />
            <div>
              <Button
                type="submit"
                className="w-full bg-primaryClr-600 rounded-2.5xl hover:bg-primaryClr-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("is_loading") : t("reset_password")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
