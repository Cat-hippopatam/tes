"use client";

import { useState } from "react";
import CustomModal from "./modal";
import LoginForm from "@/forms/auth/login.form";
import RegisterForm from "@/forms/auth/registration.form";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

type AuthMode = "login" | "register";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: IProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "login" ? "Вход в аккаунт" : "Создание аккаунта"}
      size="md"
    >
      {mode === "login" ? (
        <LoginForm
          onClose={onClose}
          onSwitchToRegister={() => setMode("register")}
        />
      ) : (
        <RegisterForm
          onClose={onClose}
          onSwitchToLogin={() => setMode("login")}
        />
      )}
    </CustomModal>
  );
}