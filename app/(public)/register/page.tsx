'use client';

import RegisterForm from "@/forms/auth/registration.form";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  
  const handleClose = () => {
    router.push('/');
  };
  
  const handleSwitchToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-[#F4A261] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">Э</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-[#264653] mb-2">Создание аккаунта</h1>
          <p className="text-[#6C757D]">
            Зарегистрируйтесь, чтобы начать обучение
          </p>
        </div>

        {/* Форма регистрации */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <RegisterForm 
            onClose={handleClose} 
            onSwitchToLogin={handleSwitchToLogin} 
          />
          
          <div className="mt-6 text-center">
            <p className="text-[#6C757D]">
              Уже есть аккаунт?{" "}
              <Link href="/login" className="text-[#F4A261] hover:text-[#e08e4a] font-medium">
                Войти
              </Link>
            </p>
          </div>
        </div>

        {/* Назад */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-[#6C757D] hover:text-[#264653] text-sm">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
