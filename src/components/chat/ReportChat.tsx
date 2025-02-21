"use client";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { OctagonAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { usePostData } from "@/hooks/useFetch";

const ReportChat = ({ sessionId }: { sessionId?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("chat");

  const { mutateAsync } = usePostData({ endpoint: "/chat/report" });

  const form = useForm({
    defaultValues: { reason: "", sessionId },
  });

  const handleFormSubmit = async (data: any) => {
    let id;
    toast.dismiss(id);

    const res = await mutateAsync(data);
    if (res.status === "fail") {
      const concatenateErrors = Object.values(res.message).join("\n");
      id = toast.error(concatenateErrors, { duration: 5000 });
    }

    if (res.status === "success") {
      toast.success(t("reported-success"), {
        duration: 3000,
      });

      setIsOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-primaryClr flex items-center gap-2 hover:text-primaryClr-800">
          <OctagonAlertIcon size={18} />

          <span className="text-sm">{t("report")}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-semibold">{t("report-account")}</DialogTitle>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base">{t("message")}</FormLabel>

                    <FormControl>
                      <textarea
                        {...field}
                        rows={5}
                        required
                        className="resize-none w-full rounded-md border border-input px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-gray-400"
                        placeholder={t("placeholder")}
                      ></textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {t("save_btn")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    form.reset();
                  }}
                >
                  {t("cancel_btn")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportChat;
