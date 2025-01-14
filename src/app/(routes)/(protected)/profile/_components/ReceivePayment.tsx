"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Link, Mail, Smartphone, Wallet2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import omitEmpty from "omit-empty";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createHeaders } from "@/lib/createHeaders";
import type { FetchData } from "@/lib/request";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { usePatchData } from "@/hooks/useFetch";

import { PaymentDetailsSchema } from "@/schemas/user/profile";

export const ReceivePayment = ({ defaultValues }: { defaultValues: any }) => {
  const t = useTranslations("profile.receivePayment");
  const [isOpen, setIsOpen] = useState(false);

  const headers = createHeaders();

  type PaymentDetailsSchema = z.infer<typeof PaymentDetailsSchema>;
  const form = useForm<PaymentDetailsSchema>({
    resolver: zodResolver(PaymentDetailsSchema),
    defaultValues,
  });
  const { isSubmitting } = form.formState;

  const endpoint = "/payment/userDetails";
  const props: FetchData = { endpoint, config: { headers } };
  const { mutateAsync } = usePatchData(props);

  const handleFormSubmit = async (data: PaymentDetailsSchema) => {
    let id;
    toast.dismiss(id);
    const cleanedData = omitEmpty({
      IBAN: data.IBAN,
      wallet_phone: data.wallet_phone,
      country: data.country,
      city: data.city,
      payout_type: data.payout_type,
    });

    const res = await mutateAsync(cleanedData);
    if (res.status === "fail") {
      const concatenateErrors = Object.values(res.message).join("\n");
      id = toast.error(concatenateErrors, { duration: 5000 });
    }

    if (res.status === "success") {
      toast.success(t("updated"), {
        description: t("updated_desc"),
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={isOpen} modal onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wallet2Icon size={22} />
          <span>{t("title")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="space-y-5 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl md:text-2xl">{t("title")}</DialogTitle>
          <DialogDescription className="text-center md:text-lg">{t("modal_description")}</DialogDescription>
        </DialogHeader>

        {/* Data Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* */}
              <FormField
                control={form.control}
                name="payout_type"
                defaultValue="BANK"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <FormLabel
                          htmlFor="BANK"
                          className="flex-1 flex items-center gap-x-2 border rounded-md px-2 py-4 cursor-pointer has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-900 has-[:checked]:ring-indigo-200"
                        >
                          <RadioGroupItem value="BANK" id="BANK" />
                          <span>{t("payout_type.bank")}</span>
                        </FormLabel>

                        <FormLabel
                          htmlFor="WALLET"
                          className="flex-1 flex items-center gap-x-2 border rounded-md px-2 py-4 cursor-pointer has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-900 has-[:checked]:ring-indigo-200"
                        >
                          <RadioGroupItem value="WALLET" id="WALLET" />
                          <span>{t("payout_type.wallet")}</span>
                        </FormLabel>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("payout_type") === "WALLET" ? (
                <FormField
                  control={form.control}
                  name="wallet_phone"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>{t("wallet-phone.label")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Smartphone className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                          <Input
                            type="text"
                            placeholder={t("wallet-phone.placeholder")}
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
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="IBAN"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>IBAN</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("IBAN.placeholder")}
                            className="bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("country.label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("country.placeholder")}
                            className="bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("city.label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("city.placeholder")}
                            className="bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <Button>{t("save_btn")}</Button>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                {t("cancel_btn")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
