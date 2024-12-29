"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyholeIcon, Mail, MapPin, Phone, Smartphone, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import omitEmpty from "omit-empty";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createHeaders } from "@/lib/createHeaders";
import { FetchData } from "@/lib/request";

import { ImageHeader } from "@/components/profile/image-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useGetData, usePatchData } from "@/hooks/useFetch";
import { useModalStore } from "@/hooks/useModalStore";

import { CitySchema } from "@/schemas/city";
import { createCustomerSchema } from "@/schemas/user";
import { CustomerProfile } from "@/schemas/user";

export const EditCustomerModal = () => {
  const dir = useLocale() === "ar" ? "rtl" : "ltr";
  const t = useTranslations("profile.updateProfile");
  const { isOpen, closeModal, type, data } = useModalStore();
  const isModalOpen = type === "editCustomer" && isOpen && data;

  const headers = createHeaders();

  const [inputTypePassword, setInputTypePassword] = useState(true);
  const customerSchema = createCustomerSchema({
    name: { required: t("name.customer.validation.required"), invalid: t("name.customer.validation.invalid") },
    email: { required: t("email.validation.required"), invalid: t("email.validation.invalid") },
    password: { required: t("password.validation.required"), invalid: t("password.validation.invalid") },
    phone: { required: t("phone.validation.required"), invalid: t("phone.validation.invalid") },
    location: { required: t("location.validation.required") },
  })
    .pick({ name: true, email: true, password: true, phone: true, location: true })
    .partial();
  type CustomerSchema = z.infer<typeof customerSchema>;
  const userData = data as CustomerProfile;
  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: { ...userData, password: "" },
  });
  const { isSubmitting } = form.formState;

  const { data: citiesData } = useGetData<z.infer<typeof CitySchema>[]>({ endpoint: "/cities", config: {} });
  const cities = citiesData?.status === "success" ? citiesData.response : [];

  const endpoint = "/customer/profile";
  const props: FetchData = { endpoint, config: { headers } };
  const { mutateAsync, status } = usePatchData(props);

  const profileEndpoint = "/profile";
  const profileProps: FetchData = { endpoint: profileEndpoint, config: { headers } };
  const { refetch } = useGetData(profileProps);

  useEffect(() => {
    if (userData && isModalOpen) form.reset(userData);
  }, [userData, form, isModalOpen]);

  const handleInputTypeChange = () => {
    setInputTypePassword((prev) => !prev);
  };

  const findCity = (name: string) => {
    const city = cities.find((city) => city.name === name);
    return city?.id.toString();
  };

  const handleModalClose = () => {
    closeModal();
    form.reset();
  };

  const handleFormSubmit = async (data: CustomerSchema) => {
    let id;
    toast.dismiss(id);
    const cleanedData = omitEmpty({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      city_id: parseInt(data.location as string),
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
      handleModalClose();
      refetch();
    }
  };

  if (!isModalOpen) return null;
  return (
    <Dialog open={isOpen} modal onOpenChange={handleModalClose}>
      <DialogContent className="space-y-5 max-w-2xl">
        <DialogHeader className="hidden">
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("modal_description")}</DialogDescription>
        </DialogHeader>

        {/* Profile Image Form */}
        <ImageHeader
          type="editCustomer"
          name={userData.name}
          email={userData.email}
          src={userData.image as string | undefined}
        />

        {/* Data Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name.customer.label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserRound className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                        <Input
                          type="text"
                          placeholder={t("name.customer.placeholder")}
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
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone.label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Smartphone className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                        <Input
                          type="text"
                          placeholder={t("phone.placeholder")}
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("location.label")}</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                      <Select onValueChange={field.onChange} defaultValue={findCity(field.value as string)}>
                        <FormControl className="pe-3.5">
                          <SelectTrigger dir={dir} className="px-9 bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5">
                            <SelectValue placeholder={t("location.placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent dir={dir}>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={city.id.toString()}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage className="!mt-2 text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <Button disabled={status === "pending" || isSubmitting} type="submit">
                {t("save_btn")}
              </Button>
              <Button
                disabled={status === "pending" || isSubmitting}
                type="button"
                variant="outline"
                onClick={handleModalClose}
              >
                {t("cancel_btn")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
