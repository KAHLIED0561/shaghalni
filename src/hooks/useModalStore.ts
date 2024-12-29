import { create } from "zustand";

export type ModalType =
  | "verifyEmail"
  | "editCustomer"
  | "editFreelancer"
  | "editEngineering"
  | "editContractor"
  | "addOffer"
  | "addReview";

type ModalStore = {
  type: ModalType | null;
  isOpen: boolean;
  openModal: (type: ModalType, data?: unknown) => void;
  closeModal: () => void;
  data?: unknown;
};

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  openModal: (type, data) => set({ type, isOpen: true, data }),
  closeModal: () => set({ isOpen: false, type: null, data: null }),
}));
