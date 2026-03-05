// components/providers/ModalProvider.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useModalStore } from '@/store/useModalStore';
import { AuthModal, ConfirmModal, FavoriteModal, PaymentModal, SubscribeModal } from '@/components/UI/modals';

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);
  const { currentModal, modalProps, closeModal } = useModalStore();

  // Предотвращаем гидратацию
  useEffect(() => {
    setIsMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modals = useMemo(() => ({
    auth: (
      <AuthModal
        isOpen={currentModal === 'auth'}
        onClose={closeModal}
        initialMode={(modalProps as any)?.mode ?? 'login'}
      />
    ),
    subscribe: (
      <SubscribeModal
        isOpen={currentModal === 'subscribe'}
        onClose={closeModal}
      />
    ),
    payment: (
      <PaymentModal
        isOpen={currentModal === 'payment'}
        onClose={closeModal}
        productId={(modalProps as any)?.productId}
        priceId={(modalProps as any)?.priceId}
      />
    ),
    confirm: (
      <ConfirmModal
        isOpen={currentModal === 'confirm'}
        onClose={closeModal}
        title={(modalProps as any)?.title}
        message={(modalProps as any)?.message}
        confirmText={(modalProps as any)?.confirmText}
        cancelText={(modalProps as any)?.cancelText}
        onConfirm={(modalProps as any)?.onConfirm}
      />
    ),
    favorite: (
      <FavoriteModal
        isOpen={currentModal === 'favorite'}
        onClose={closeModal}
        contentId={(modalProps as any)?.contentId}
      />
    ),
  }), [currentModal, modalProps, closeModal]);

  if (!isMounted) return null;

  return (
    <>
      {currentModal && modals[currentModal]}
    </>
  );
}