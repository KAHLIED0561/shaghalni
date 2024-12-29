"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cookies from "js-cookie";
import { Eye, EyeOff, LockKeyholeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { postData } from "@/lib/request";

import { FormErrors } from "@/components/auth/form-errors";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FormSuccess } from "./form-success";
import { loginAction } from "@/actions/login";
import { PASSWORD_RESET } from "@/constant";
import { ResetPassSchema } from "@/schemas/auth/reset-pass";

type ValidationMessages = {
  password: {
    required: string;
    invalid: string;
  };
  confirmPassword: {
    required: string;
    mismatch: string;
  };
};

const createNewPasswordSchema = (messages: ValidationMessages) =>
  z
    .object({
      password: z.string({ message: messages.password.required }).min(8, { message: messages.password.invalid }),
      confirmPassword: z.string().min(1, { message: messages.confirmPassword.required }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.confirmPassword.mismatch,
      path: ["confirmPassword"],
    });

export const NewPasswordForm = () => {
  const router = useRouter();
  const t = useTranslations("auth.new_password");
  const [inputTypePassword, setInputTypePassword] = useState(true);
  const [inputTypeConfirmPassword, setInputTypeConfirmPassword] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [successes, setSuccess] = useState<string[]>([]);
  const newPasswordSchema = createNewPasswordSchema({
    password: { required: t("password.validation.required"), invalid: t("password.validation.invalid") },
    confirmPassword: {
      required: t("confirm_password.validation.required"),
      mismatch: t("confirm_password.validation.mismatch"),
    },
  });
  type NewPasswordSchemaSchema = z.infer<typeof newPasswordSchema>;
  const form = useForm<NewPasswordSchemaSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const { isSubmitting } = form.formState;

  const handleInputTypeChange = () => {
    setInputTypePassword((prev) => !prev);
  };

  const handleInputTypeConfirmChange = () => {
    setInputTypeConfirmPassword((prev) => !prev);
  };

  const handleFormSubmit = async (data: NewPasswordSchemaSchema) => {
    setErrors([]);
    setSuccess([]);

    const tmpSession = cookies.get(PASSWORD_RESET);
    if (!tmpSession) {
      router.replace("/forgot-password");
      return;
    }

    const res = await postData<z.infer<typeof ResetPassSchema>>({
      endpoint: "/auth/reset-password",
      config: {
        body: { newPassword: data.password, tmpSession },
      },
    });

    if (res.status === "success") {
      await loginAction(res.response.token, false);
      cookies.remove(PASSWORD_RESET);
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
                        title={inputTypePassword ? t("password.show") : t("password.hide")}
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirm_password.label")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LockKeyholeIcon className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Input
                        type={inputTypeConfirmPassword ? "password" : "text"}
                        placeholder={t("confirm_password.placeholder")}
                        className="px-9 bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5"
                        disabled={isSubmitting}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={handleInputTypeConfirmChange}
                        className="absolute end-3.5 top-1/2 -translate-y-1/2"
                        title={inputTypeConfirmPassword ? t("confirm_password.show") : t("confirm_password.hide")}
                      >
                        {inputTypeConfirmPassword ? (
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
            <FormSuccess successes={successes} />
            <div className="!mt-6">
              <Button
                type="submit"
                className="w-full bg-primaryClr-600 rounded-2.5xl hover:bg-primaryClr-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("is_loading") : t("set_password")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
