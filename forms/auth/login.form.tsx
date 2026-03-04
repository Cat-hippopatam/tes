"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button } from "@heroui/react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { signInWithCredentials } from "@/actions/sing-in";

interface IProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onClose, onSwitchToRegister }: IProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithCredentials(formData.email, formData.password);
      
      if (result?.error) {
        setError("Неверный email или пароль");
      } else {
        router.refresh();
        onClose();
      }
    } catch (err) {
      setError("Произошла ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        isRequired
        type="email"
        label="Email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        startContent={<EnvelopeIcon className="w-4 h-4 text-gray-400" />}
        isInvalid={!!error}
      />

      <Input
        isRequired
        type="password"
        label="Пароль"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        startContent={<LockClosedIcon className="w-4 h-4 text-gray-400" />}
      />

      {error && (
        <div className="p-3 rounded-lg text-sm bg-red-50 text-red-600 w-full">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 w-full pt-4">
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
          style={{ backgroundColor: "#F4A261", color: "white" }}
        >
          {isLoading ? "Вход..." : "Войти"}
        </Button>

        <Button type="button" variant="light" onPress={onClose} className="w-full">
          Отмена
        </Button>

        <div className="text-center text-sm mt-2">
          <span className="text-gray-500">Нет аккаунта? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium hover:underline"
            style={{ color: "#2A9D8F" }}
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </Form>
  );
}