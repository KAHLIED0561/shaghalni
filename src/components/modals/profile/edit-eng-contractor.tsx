"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  BriefcaseBusiness,
  Building,
  Eye,
  EyeOff,
  IdCard,
  LockKeyholeIcon,
  Mail,
  MapPin,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import omitEmpty from "omit-empty";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createHeaders } from "@/lib/createHeaders";
import type { FetchData } from "@/lib/request";

import { ImageHeader } from "@/components/profile/image-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RemovableItem from "@/components/ui/removableItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useGetData, usePatchData } from "@/hooks/useFetch";
import { useModalStore } from "@/hooks/useModalStore";

import { CitySchema } from "@/schemas/city";
import { ServiceSchema } from "@/schemas/service";
import { createEngineeringContractorSchema } from "@/schemas/user";
import { EngCustomerProfile } from "@/schemas/user";

export const EditEngContractorModal = () => {
  const dir = useLocale() === "ar" ? "rtl" : "ltr";
  const t = useTranslations("profile.updateProfile");
  const { isOpen, closeModal, type, data } = useModalStore();
  const isModalOpen = (type === "editEngineering" || type === "editContractor") && isOpen && data;
  const isEngineering = type === "editEngineering";

  const headers = createHeaders();

  const [inputTypePassword, setInputTypePassword] = useState(true);
  const engineeringContractorSchema = createEngineeringContractorSchema({
    name: { required: t("name.customer.validation.required"), invalid: t("name.customer.validation.invalid") },
    email: { required: t("email.validation.required"), invalid: t("email.validation.invalid") },
    password: { required: t("password.validation.required"), invalid: t("password.validation.invalid") },
    phone: { required: t("phone.validation.required"), invalid: t("phone.validation.invalid") },
    location: { required: t("location.validation.required") },
    commercialRegister: { required: t("commercial_register.validation.required") },
    facilityType: { required: t("facility_type.validation.required") },
    activities: { required: t("activities.validation.required") },
    description: { required: t("description.validation.required") },
    image: {
      required: t("personal_image.validation.required"),
      size: t("personal_image.validation.size"),
      type: t("personal_image.validation.type"),
    },
  })
    .extend({
      commercial_register_number: z.string().min(1, { message: t("commercial_register.validation.required") }),
    })
    .pick({
      name: true,
      email: true,
      password: true,
      phone: true,
      location: true,
      activities: true,
      commercial_register_number: true,
      facilityType: true,
      description: true,
    })
    .extend({
      password: z.string().refine((val) => {
        if (!val) return true;
        return val.length >= 8;
      }, t("password.validation.invalid")),
    })
    .partial();
  type EngineeringContractorSchema = z.infer<typeof engineeringContractorSchema>;
  const userData = data as EngCustomerProfile;
  const form = useForm<EngineeringContractorSchema>({
    resolver: zodResolver(engineeringContractorSchema),
  });
  const { isSubmitting } = form.formState;

  const { data: citiesData } = useGetData<z.infer<typeof CitySchema>[]>({ endpoint: "/cities", config: {} });
  const cities = citiesData?.status === "success" ? citiesData.response : [];
  const { data: servicesData } = useGetData<z.infer<typeof ServiceSchema>[]>({ endpoint: "/services", config: {} });
  const services = servicesData?.status === "success" ? servicesData.response : [];
  type FacilityType = {
    contractorTypes: z.infer<typeof ServiceSchema>[];
  };
  const { data: facilityData } = useGetData<FacilityType>({
    endpoint: "/contractors/types",
    config: {},
  });
  const facilityTypes = facilityData?.status === "success" ? facilityData.response.contractorTypes : [];

  const endpoint = isEngineering ? "/offices/profile" : "/contractors/profile";
  const props: FetchData = { endpoint, config: { headers } };
  const { mutateAsync } = usePatchData(props);

  const profileEndpoint = "/profile";
  const profileProps: FetchData = { endpoint: profileEndpoint, config: { headers } };
  const { refetch } = useGetData(profileProps);

  useEffect(() => {
    if (userData && isModalOpen) {
      form.reset({
        ...userData,
        password: "",
        facilityType: userData.facilityType.name,
        activities: userData.services.map((service) => service.name),
        description: userData.about,
      });
    }
  }, [userData, form, isModalOpen]);
  const handleInputTypeChange = () => {
    setInputTypePassword((prev) => !prev);
  };

  const findCity = (name: string) => {
    const city = cities.find((city) => city.name === name);
    return city?.id.toString();
  };

  const findService = (name: string) => {
    const service = services.find((service) => service.name === name);
    return service?.id.toString();
  };

  const findFacilityType = (name: string) => {
    const facilityType = facilityTypes.find((facilityType) => facilityType.name === name);
    return facilityType?.id.toString();
  };

  const handleModalClose = () => {
    closeModal();
    form.reset();
  };

  const handleFormSubmit = async (data: EngineeringContractorSchema) => {
    let id;
    toast.dismiss(id);
    const cleanedData = omitEmpty({
      ...data,
      city_id: parseInt(data.location as string),
      about: data.description,
      type: findFacilityType(data.facilityType as string),
      services: data.activities
        ? data.activities.map((activity) => parseInt(findService(activity) as string))
        : undefined,
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
          type={isEngineering ? "editEngineering" : "editContractor"}
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
                name="commercial_register_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("commercial_register.label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IdCard className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                        <Input
                          type="text"
                          placeholder={t("commercial_register.placeholder")}
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
                      <Select onValueChange={field.onChange} defaultValue={findCity(field.value ? field.value : "")}>
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
              <FormField
                control={form.control}
                name="facilityType"
                render={({ field: { onChange, value } }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t("facility_type.label")}</FormLabel>
                      <div className="relative">
                        <Building className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                        <Select onValueChange={onChange} defaultValue={value}>
                          <FormControl className="pe-3.5">
                            <SelectTrigger dir={dir} className="px-9 bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5">
                              <SelectValue placeholder={t("facility_type.placeholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent dir={dir}>
                            {facilityTypes.map((facilityType) => (
                              <SelectItem key={facilityType.id} value={facilityType.name}>
                                {facilityType.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage className="!mt-2 text-xs" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="activities"
                render={({ field: { value, onChange } }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t("activities.label")}</FormLabel>
                      <div className="relative overflow-hidden">
                        <BriefcaseBusiness className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                        <Select onValueChange={(newValue) => onChange([...(value as string[]), newValue])}>
                          <FormControl className="pe-3.5">
                            <>
                              <SelectTrigger
                                dir={dir}
                                className="ps-9 bg-[#F6FBF8] rounded-2.5xl justify-end border-garyClr focus:ring-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {!(value && value.length > 0) && (
                                  <span className=" flex-1 text-start text-sm text-gray-500 select-none">
                                    {t("activities.placeholder")}
                                  </span>
                                )}
                              </SelectTrigger>
                              <div className="mx-8 sm:mx-9 inline-flex gap-2 items-center absolute top-0 bottom-0 max-w-[calc(100%-4rem)] hide-scrollbar sm:narrow-scrollbar overflow-y-auto">
                                {value &&
                                  value.length > 0 &&
                                  value?.map((activity) => (
                                    <RemovableItem
                                      key={findService(activity)}
                                      size="sm"
                                      value={activity}
                                      onRemove={(val) => {
                                        console.log("value", value);
                                        onChange(value.filter((v) => v !== val));
                                      }}
                                    />
                                  ))}
                              </div>
                            </>
                          </FormControl>
                          <SelectContent dir={dir}>
                            {services.map((service) => (
                              <SelectItem
                                key={service.id}
                                value={service.name}
                                disabled={value?.includes(service.name)}
                              >
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage className="!mt-2 text-xs" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>{t("description.label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <BookOpen className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
                        <Input
                          type="text"
                          placeholder={t("description.placeholder")}
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
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <Button>{t("save_btn")}</Button>
              <Button type="button" variant="outline" onClick={handleModalClose}>
                {t("cancel_btn")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
