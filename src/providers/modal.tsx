"use client";

import { useEffect, useState } from "react";

import { AddOfferModal, ReviewModal, VerifyEmailModal } from "@/components/modals";
import { EditCustomerModal, EditEngContractorModal, EditFreelancerModal } from "@/components/modals/profile";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <>
      <VerifyEmailModal />
      <EditCustomerModal />
      <EditFreelancerModal />
      <EditEngContractorModal />
      <AddOfferModal />
      <ReviewModal />
    </>
  );
};
