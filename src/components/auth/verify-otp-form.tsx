"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { postData } from "@/lib/request";

import { FormErrors } from "@/components/auth/form-errors";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import { FormSuccess } from "./form-success";
import { resetPassAction } from "@/actions/reset-pass";
import { EMAIL_ADDRESS } from "@/constant";
import { VerifyOtpSchema } from "@/schemas/auth/verify-otp";

type ValidationMessages = {
  otp: { required: string; invalid: string };
};

const createOtpSchema = (messages: ValidationMessages) =>
  z.object({
    otp: z
      .string({ required_error: messages.otp.required, message: messages.otp.invalid })
      .min(6, { message: messages.otp.invalid }),
  });

export const VerifyOtpForm = () => {
  const t = useTranslations("auth.verify_otp");
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [successes, setSuccess] = useState<string[]>([]);
  const [resending, setResending] = useState(false);
  const otpSchema = createOtpSchema({
    otp: { required: t("otp.validation.required"), invalid: t("otp.validation.invalid") },
  });
  type OtpSchema = z.infer<typeof otpSchema>;
  const form = useForm<OtpSchema>({ resolver: zodResolver(otpSchema) });
  const { isSubmitting } = form.formState;

  const handleResendOtp = async () => {
    setErrors([]);
    setSuccess([]);
    setResending(true);
    const email = cookies.get(EMAIL_ADDRESS);
    if (!email) {
      router.replace("/forgot-password");
      setResending(false);
      return;
    }

    const res = await postData({ endpoint: "/auth/forget-password", config: { body: { email } } });
    if (res.status === "success") {
      setSuccess([t("sent_message")]);
      setResending(false);
      return;
    }

    if (typeof res.message === "string") setErrors([res.message]);
    else setErrors(res.message);
    setResending(false);
  };

  const handleFormSubmit = async (data: OtpSchema) => {
    setErrors([]);
    setSuccess([]);

    const email = cookies.get(EMAIL_ADDRESS);
    if (!email) {
      router.replace("/forgot-password");
      setResending(false);
      return;
    }

    const res = await postData<z.infer<typeof VerifyOtpSchema>>({
      endpoint: "/auth/verify-reset-password-token",
      config: { body: { email, token: data.otp } },
    });

    if (res.status === "success") {
      await resetPassAction(res.response.tmpSession);
      return;
    }

    if (typeof res.message === "string") setErrors([res.message]);
    else setErrors(res.message);
  };

  return (
    <div className="mt-4 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col items-center">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem dir="ltr">
                  <FormLabel className="sr-only">{t("otp.label")}</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      {...field}
                    >
                      <InputOTPGroup className="w-full flex items-center justify-center md:justify-start xs:gap-4 text-4xl placeholder:text-4xl">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="xs:size-12 sm:size-16 text-4xl placeholder:text-4xl bg-[#E5E5E5]/20 font-semibold rounded-lg"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess successes={successes} />
            <FormErrors errors={errors} />
            <div className="w-full flex justify-center md:justify-start">
              <span className="text-garyClr text-center md:text-start">
                {t("did_not_receive")}{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-primaryClr font-medium px-0"
                  onClick={handleResendOtp}
                  disabled={resending || isSubmitting}
                >
                  {resending ? t("resending") : t("resend")}
                </Button>
              </span>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-primaryClr-600 rounded-2.5xl hover:bg-primaryClr-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("is_loading") : t("next")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
