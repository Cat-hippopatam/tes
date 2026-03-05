// store/useModalStore.ts
import { create } from "zustand";

export type ModalType =
  | null
  | "auth"
  | "subscribe"
  | "payment"
  | "confirm"
  | "favorite";

export interface BaseModalProps {
  // общее: можно расширять по мере необходимости
}

export interface AuthModalProps extends BaseModalProps {
  mode?: "login" | "register";
}

export interface ConfirmModalProps extends BaseModalProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export type ModalPropsMap = {
  auth: AuthModalProps;
  subscribe: BaseModalProps;
  payment: BaseModalProps & { productId?: string; priceId?: string };
  confirm: ConfirmModalProps;
  favorite: BaseModalProps & { contentId?: string };
};

interface ModalState {
  currentModal: ModalType;
  // хранит пропсы для конкретной модалки
  modalProps: Partial<ModalPropsMap[keyof ModalPropsMap]> | null;
  openModal: <T extends Exclude<ModalType, null>>(
    type: T,
    props?: Partial<ModalPropsMap[T]>
  ) => void;
  closeModal: () => void;
  // обратная совместимость
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  currentModal: null,
  modalProps: null,
  openModal: (type, props) => set({ currentModal: type, modalProps: props ?? null }),
  closeModal: () => set({ currentModal: null, modalProps: null }),
  // совместимость с существующим кодом
  openAuthModal: (mode = "login") => set({ currentModal: "auth", modalProps: { mode } }),
  closeAuthModal: () => set({ currentModal: null, modalProps: null }),
}));