"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Attachments } from "./attachments";
import { ChooseTypeForm } from "./choose-type";
import { DataForm } from "./data-form";
import { RequestServiceFormHeader } from "./form-header";

export const RequestServiceForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const step = searchParams.get("step");
  const isFirst = step === "1";
  const isSecond = step === "2";
  const isLast = step === "3";

  useEffect(() => {
    if (!isFirst && !isSecond && !isLast) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", "1");
      router.replace(`?${params.toString()}`);
    }
  }, [isLast, isFirst, isSecond, searchParams, router]);

  return (
    <div className="space-y-10">
      <RequestServiceFormHeader step={step} />
      <div className="container bg-[#FDFEFE] border border-[#E5E5E5] rounded-2.5xl py-8">
        {isFirst && <ChooseTypeForm />}
        {isSecond && <DataForm />}
        {isLast && <Attachments />}
      </div>
    </div>
  );
};
