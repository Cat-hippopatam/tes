// components/common/modal-trigger.tsx
"use client";

import { useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";

export default function ModalTrigger() {
  const openModal = useModalStore((state) => state.openModal);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Проверяем кнопки с data-open-modal
      const modalButton = target.closest("[data-open-modal]");
      if (modalButton) {
        e.preventDefault();
        const modalType = modalButton.getAttribute("data-open-modal") as "auth" | "subscribe" | "payment" | "confirm" | "favorite";
        
        if (modalType) {
          // Собираем дополнительные данные из data-атрибутов
          const props: Record<string, string> = {};
          for (const attr of modalButton.attributes) {
            if (attr.name.startsWith("data-") && !attr.name.startsWith("data-open-modal")) {
              const key = attr.name.replace("data-", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
              props[key] = attr.value;
            }
          }
          
          openModal(modalType, props as any);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [openModal]);

  return null;
}
