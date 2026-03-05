// components/providers/ModalProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import AuthModal from '@/components/UI/modals/AuthModal';
import { useModalStore } from '@/store/useModalStore';

export default function ModalProvider() {
    const [isMounted, setIsMounted] = useState(false);
    const { isAuthModalOpen, authModalMode, closeAuthModal } = useModalStore();

    // Предотвращаем гидратацию
    useEffect(() => {
        // Это безопасно, так как эффект запускается только один раз после монтирования
        setIsMounted(true);
        
        // Этот эффект не должен иметь зависимостей, так как нам нужно 
        // выполнить setIsMounted только один раз при монтировании
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <AuthModal 
                isOpen={isAuthModalOpen}
                onClose={closeAuthModal}
                initialMode={authModalMode}
            />
        </>
    );
}