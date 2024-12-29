"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import cookies from "js-cookie";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormErrors } from "@/components/auth/form-errors";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import { usePostData } from "@/hooks/useFetch";
import { useModalStore } from "@/hooks/useModalStore";

import { loginAction } from "@/actions/login";
import { EMAIL_ADDRESS } from "@/constant";

type ValidationMessages = {
  otp: { required: string; invalid: string };
};

const createOtpSchema = (messages: ValidationMessages) =>
  z.object({
    otp: z
      .string({ required_error: messages.otp.required, message: messages.otp.invalid })
      .min(6, { message: messages.otp.invalid }),
  });

const VerificationSchema = z.object({
  message: z.string(),
  token: z.string(),
});

export const VerifyEmailModal = () => {
  const { isOpen, closeModal, type } = useModalStore();
  const [errors, setErrors] = useState<string[]>([]);
  const t = useTranslations("auth.verify_email");
  const otpSchema = createOtpSchema({
    otp: { required: t("otp.required"), invalid: t("otp.invalid") },
  });
  type OtpSchema = z.infer<typeof otpSchema>;
  const form = useForm<OtpSchema>({ resolver: zodResolver(otpSchema) });
  const { mutateAsync } = usePostData<z.infer<typeof VerificationSchema>>({ endpoint: "/auth/verify" });
  const { isSubmitting } = form.formState;
  const isModalOpen = type === "verifyEmail" && isOpen;

  const handleClose = () => {
    closeModal();
    form.reset();
  };

  const handleFormSubmit = async (data: OtpSchema) => {
    setErrors([]);
    const email = cookies.get(EMAIL_ADDRESS);
    if (!email) {
      setErrors([t("email_not_found")]);
      return;
    }
    const res = await mutateAsync({ email, token: data.otp });
    const success = res?.status === "success";
    if (!success) {
      if (typeof res.message === "string") setErrors([res.message]);
      else setErrors(res.message);
      return;
    }

    await loginAction(res.response.token);
    closeModal();
    form.reset();
  };

  if (!isModalOpen) return null;
  return (
    <Dialog open={isOpen} modal={true} onOpenChange={handleClose}>
      <DialogContent
        className="bg-white text-black p-0 overflow-hidden py-12 rounded-2.5xl w-full relative"
        // [&>button]:hidden // hide close button
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="*:text-center space-y-1.5 px-8">
          <DialogTitle className="font-semibold text-4xl">{t("tile")}</DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex justify-center">
            <div className="flex flex-col items-center gap-2 w-fit px-8">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem dir="ltr">
                    <FormLabel className="sr-only">{t("tile")}</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        {...field}
                      >
                        <InputOTPGroup className="flex items-center justify-center md:justify-start xs:gap-4 text-4xl placeholder:text-4xl">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="sm:size-16 text-4xl placeholder:text-4xl bg-[#E5E5E5]/20 font-semibold rounded-lg"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
              <FormErrors errors={errors} />
              <div className="w-full flex justify-center">
                <span className="text-garyClr text-center">
                  {t("not_received.title")}{" "}
                  <Button type="button" variant="link" className="text-primaryClr font-medium px-0">
                    {t("not_received.resend")}
                  </Button>
                </span>
              </div>
              <div className="w-full">
                <Button
                  type="submit"
                  className="w-full bg-primaryClr-600 rounded-2.5xl hover:bg-primaryClr-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("is_loading") : t("verify")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
