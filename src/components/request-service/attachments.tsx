"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createHeaders } from "@/lib/createHeaders";
import { shortenString } from "@/lib/utils";

import { FormErrors } from "@/components/auth/form-errors";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { RequestType } from "./request-type";
import { createAttachmentsFormSchema } from "@/schemas/service/attachments";

export const Attachments = () => {
  const lang = useLocale();
  const t = useTranslations("service_req");
  const router = useRouter();
  const headers = createHeaders();
  const [serviceType] = useQueryState("type", {
    defaultValue: RequestType.TECHNICIAN,
    history: "replace",
  });
  const [id] = useQueryState("id", parseAsInteger);
  const [errors, setErrors] = useState<string[]>([]);

  const isTechnician = serviceType === RequestType.TECHNICIAN;

  const attachmentsSchema = createAttachmentsFormSchema({
    drawings: {
      required: t("other.drawings.required"),
      size: t("other.drawings.size"),
      type: t("other.drawings.type"),
    },
    building: { size: t("other.building.size"), type: t("other.building.type") },
    attachments: { size: t("attachments.size"), type: t("attachments.type") },
  }).pick({
    drawings: isTechnician ? undefined : true,
    building: isTechnician ? undefined : true,
    attachments: true,
  });
  type AttachmentsSchema = z.infer<typeof attachmentsSchema>;

  const form = useForm<AttachmentsSchema>({
    resolver: zodResolver(attachmentsSchema),
    defaultValues: { drawings: undefined, building: undefined, attachments: undefined },
  });
  const { isSubmitting } = form.formState;

  const handleFormSubmit = async (data: AttachmentsSchema) => {
    setErrors([]);
    const endpoint = `https://api.shaghalni.sa/requests/${id}/attachments`;
    const formData = new FormData();
    if (data.drawings) formData.append("drawings", data.drawings);
    if (data.building) formData.append("building", data.building);
    if (data.attachments) formData.append("attachments", data.attachments);
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { ...headers, lang }, body: formData });
      const result = await response.json();

      if (response.ok) {
        toast.success(t("created"), {
          description: t("created_desc"),
          duration: 3000,
        });
        router.push(`/projects/${id}`);
      } else {
        if (typeof result.message === "string") setErrors([result.message]);
        else setErrors(result.message);
      }
    } catch (error) {
      setErrors(["لقد حدث خطأ ما، يرجى المحاولة مرة أخرى"]);
    }
  };

  if (!id) throw new Error("Request ID is required");
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isTechnician && (
            <FormField
              control={form.control}
              name="drawings"
              render={({ field: { onChange, value, ...rest } }) => {
                return (
                  <FormItem>
                    <FormLabel>{t("other.drawings.label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="file"
                          multiple={false}
                          accept="image/*,.pdf,.doc,.docx"
                          placeholder={t("other.drawings.placeholder")}
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
                          {value ? shortenString(value.name, 30) : t("other.drawings.placeholder")}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
          {!isTechnician && (
            <FormField
              control={form.control}
              name="building"
              render={({ field: { onChange, value, ...rest } }) => {
                return (
                  <FormItem>
                    <FormLabel>{t("other.building.label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="file"
                          multiple={false}
                          accept="image/*,.pdf,.doc,.docx"
                          placeholder={t("other.building.placeholder")}
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
                          {value ? shortenString(value.name, 30) : t("other.building.placeholder")}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
          <FormField
            control={form.control}
            name="attachments"
            render={({ field: { onChange, value, ...rest } }) => {
              return (
                <FormItem className="sm:col-span-2">
                  <FormLabel>{t("attachments.label")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="file"
                        multiple={false}
                        accept="image/*,.pdf,.doc,.docx"
                        placeholder={t("attachments.placeholder")}
                        className="opacity-0 py-5 w-full"
                        title=""
                        disabled={isSubmitting}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        {...rest}
                      />
                      <span className="absolute inset-0 transform text-sm bg-[#F6FBF8] text-primaryClr pointer-events-none flex items-center justify-center gap-2 rounded-2.5xl border border-primaryClr text-center">
                        <CloudUpload className="size-4" />
                        {value ? shortenString(value.name, 30) : t("attachments.placeholder")}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div>
            <FormErrors errors={errors} />
          </div>
        </div>
        <div>
          <p>
            <span>{t("terms.0")}</span>{" "}
            <Link href="/terms-conditions" className="text-primaryClr hover:underline">
              {t("terms.1")}
            </Link>
          </p>
        </div>
        <div className="flex items-center justify-end">
          <Button
            type="submit"
            className="w-fit px-6 py-4 bg-primaryClr-600 rounded-2.5xl hover:bg-primaryClr-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("is_loading") : t("next")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
