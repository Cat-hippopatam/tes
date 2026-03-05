"use client";

import { useAuthStore } from "@/store/auth.store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface IProps {
    children: React.ReactNode;
}

const AppLoader = ({children} : IProps) => {
    const {data: session, status} = useSession();
    const {setAuthState} = useAuthStore();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        setAuthState(status, session);
        
        // Даем немного времени на синхронизацию состояния
        const timer = setTimeout(() => {
            setIsInitialized(true);
        }, 100);

        return () => clearTimeout(timer);
    }, [status, session, setAuthState]);

    // Показываем лоадер только при первой загрузке
    if (!isInitialized) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    {/* Логотип с анимацией */}
                    <div className="w-20 h-20 bg-gradient-to-br from-[#F4A261] to-[#e08e4a] rounded-2xl flex items-center justify-center animate-pulse">
                        <span className="text-white font-bold text-3xl">Э</span>
                    </div>
                    {/* Спиннер */}
                    <div className="w-12 h-12 border-4 border-[#F4A261] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#264653] font-medium">Загрузка...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AppLoader;