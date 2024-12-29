"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { parseAsInteger, parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { ContractorIcon, DesignerIcon, EngineeringIcon, QuantityIcon, TechnicalIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { RequestType } from "@/constant";

const createChooseTypeSchema = (message: string) => {
  return z.object({
    requestType: z.enum(
      [
        RequestType.TECHNICIAN,
        RequestType.CONTRACTOR,
        RequestType.DESIGNER,
        RequestType.ENGINEERING,
        RequestType.QUANTITY,
      ],
      { message }
    ),
  });
};

export const ChooseTypeForm = () => {
  const dir = useLocale() === "ar" ? "rtl" : "ltr";
  const t = useTranslations("service_req.initial");
  const [type, setType] = useQueryState("type", parseAsStringEnum<RequestType>(Object.values(RequestType)));
  const [, setStep] = useQueryState("step", parseAsInteger);
  const chooseTypeSchema = createChooseTypeSchema(t("required"));
  type ChooseTypeSchema = z.infer<typeof chooseTypeSchema>;
  const form = useForm<ChooseTypeSchema>({
    resolver: zodResolver(chooseTypeSchema),
    defaultValues: { requestType: RequestType.TECHNICIAN },
  });
  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (type) {
      form.setValue("requestType", type);
    }
  }, [type, form]);

  const handleTypeChange = (type: RequestType) => {
    form.setValue("requestType", type);
    setType(type, { scroll: false });
  };

  const handleFormSubmit = () => {
    setStep(2);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-medium">{t("title")}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="requestType"
            render={({ field }) => {
              const value = field.value;
              return (
                <FormItem>
                  <FormLabel className="sr-only">{t("title")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      dir={dir}
                      className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value={RequestType.TECHNICIAN} className="hidden" />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            "w-full py-8 px-4 border rounded-2.5xl flex flex-col items-center gap-4 transition-all cursor-pointer",
                            value === RequestType.TECHNICIAN
                              ? "bg-primaryClr-50/30 border-primaryClr-600 text-primaryClr"
                              : "bg-[#F6FBF8]/60 border-gray-300 text-gray-500"
                          )}
                          onClick={() => handleTypeChange(RequestType.TECHNICIAN)}
                        >
                          <TechnicalIcon
                            className="size-16"
                            stroke={{
                              className: value === RequestType.TECHNICIAN ? "#4CA672" : "#8F8F8F",
                            }}
                          />
                          <span className="font-semibold text-center">{t("types.0")}</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value={RequestType.CONTRACTOR} className="hidden" />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            "w-full py-8 px-4 border rounded-2.5xl flex flex-col items-center gap-4 transition-all cursor-pointer",
                            value === RequestType.CONTRACTOR
                              ? "bg-primaryClr-50/30 border-primaryClr-600 text-primaryClr"
                              : "bg-[#F6FBF8]/60 border-gray-300 text-gray-500"
                          )}
                          onClick={() => handleTypeChange(RequestType.CONTRACTOR)}
                        >
                          <ContractorIcon
                            className="size-16"
                            stroke={{
                              className: value === RequestType.CONTRACTOR ? "#4CA672" : "#8F8F8F",
                            }}
                          />
                          <span className="font-semibold text-center">{t("types.1")}</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value={RequestType.DESIGNER} className="hidden" />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            "w-full py-8 px-4 border rounded-2.5xl flex flex-col items-center gap-4 transition-all cursor-pointer",
                            value === RequestType.DESIGNER
                              ? "bg-primaryClr-50/30 border-primaryClr-600 text-primaryClr"
                              : "bg-[#F6FBF8]/60 border-gray-300 text-gray-500"
                          )}
                          onClick={() => handleTypeChange(RequestType.DESIGNER)}
                        >
                          <DesignerIcon
                            className="size-16"
                            stroke={{
                              className: value === RequestType.DESIGNER ? "#4CA672" : "#8F8F8F",
                            }}
                          />
                          <span className="font-semibold text-center">{t("types.2")}</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value={RequestType.ENGINEERING} className="hidden" />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            "w-full py-8 px-4 border rounded-2.5xl flex flex-col items-center gap-4 transition-all cursor-pointer",
                            value === RequestType.ENGINEERING
                              ? "bg-primaryClr-50/30 border-primaryClr-600 text-primaryClr"
                              : "bg-[#F6FBF8]/60 border-gray-300 text-gray-500"
                          )}
                          onClick={() => handleTypeChange(RequestType.ENGINEERING)}
                        >
                          <EngineeringIcon
                            className="size-16"
                            stroke={{
                              className: value === RequestType.ENGINEERING ? "#4CA672" : "#8F8F8F",
                            }}
                          />
                          <span className="font-semibold text-center">{t("types.3")}</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value={RequestType.QUANTITY} className="hidden" />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            "w-full py-8 px-4 border rounded-2.5xl flex flex-col items-center gap-4 transition-all cursor-pointer",
                            value === RequestType.QUANTITY
                              ? "bg-primaryClr-50/30 border-primaryClr-600 text-primaryClr"
                              : "bg-[#F6FBF8]/60 border-gray-300 text-gray-500"
                          )}
                          onClick={() => handleTypeChange(RequestType.QUANTITY)}
                        >
                          <QuantityIcon
                            className="size-16"
                            stroke={{
                              className: value === RequestType.QUANTITY ? "#4CA672" : "#8F8F8F",
                            }}
                          />
                          <span className="font-semibold text-center">{t("types.4")}</span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <div className="flex items-center justify-end">
            <Button type="submit" disabled={isSubmitting} className="px-10 py-4">
              {isSubmitting ? t("is_loading") : t("next")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
