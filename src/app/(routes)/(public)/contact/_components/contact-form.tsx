"use client";

import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type FormEvent, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useGetData, usePostData } from "@/hooks/useFetch";

export const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const lang = useLocale();
  const t = useTranslations("other_pages.contact_us");
  const endpoint = "/content/contact-us";
  const { data } = useGetData<{
    content: {
      email: "string";
      phone: "string";
      address: "string";
    };
  }>({ endpoint, config: { headers: { lang } } });
  const { mutateAsync } = usePostData({ endpoint: "/content/send-ticket" });
  const contact = data?.status === "success" ? data.response.content : null;

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let id;
    toast.dismiss(id);

    const formData = new FormData(e.currentTarget);
    const formVals = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("message") as string,
    };

    const res = await mutateAsync({ ...formVals });
    if (res.status === "fail") {
      const concatenateErrors = Object.values(res.message).join("\n");
      id = toast.error(concatenateErrors, { duration: 5000 });
    }

    if (res.status === "success") {
      id = toast.success("تم إرسال الرسالة بنجاح،", {
        description: "سنقوم بالرد عليك في أقرب وقت ممكن",
        duration: 5000,
      });
      formRef.current?.reset();
    }
  };

  return (
    <section className="flex flex-col-reverse md:flex-row gap-4 gap-y-8">
      <div className="bg-gray-100 rounded-2.5xl border border-gray-300 container py-6">
        <form ref={formRef} onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name.label")}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t("name.placeholder")}
                className="px-4 bg-[#F6FBF8] rounded-2xl border-garyClr py-5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email.label")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("email.placeholder")}
                className="px-4 bg-[#F6FBF8] rounded-2xl border-garyClr py-5"
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="message">{t("message.label")}</Label>
              <textarea
                id="message"
                name="message"
                placeholder={t("message.placeholder")}
                className="px-4 bg-[#F6FBF8] rounded-2xl border border-garyClr py-5 w-full"
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-4">
            {t("send")}
          </Button>
        </form>
      </div>
      {contact && (
        <div className="sm:basis-1/4 lg:basis-1/3 space-y-4">
          <div className="bg-gray-100 rounded-2.5xl border border-gray-300 container py-4 flex items-center gap-2">
            <div className="rounded-full p-4 bg-primaryClr" title="email">
              <MailIcon className="!size-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold sm:whitespace-nowrap">{t("email.label")}</h3>
              <p className="text-gray-600">{contact.email}</p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2.5xl border border-gray-300 container py-4 flex items-center gap-2">
            <div className="rounded-full p-4 bg-primaryClr" title="phone">
              <PhoneIcon className="!size-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold sm:whitespace-nowrap">{t("phone")}</h3>
              <p className="text-gray-600" dir="auto">
                {contact.phone}
              </p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2.5xl border border-gray-300 container py-4 flex items-center gap-2">
            <div className="rounded-full p-4 bg-primaryClr" title="address">
              <MapPinIcon className="!size-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold sm:whitespace-nowrap">{t("address")}</h3>
              <p className="text-gray-600">{contact.address}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
