"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button } from "@heroui/react";
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { registerUser } from "@/actions/register";

interface IProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onClose, onSwitchToLogin }: IProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateEmail(formData.email)) {
      setError("Введите корректный email");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerUser({
        email: formData.email,
        passwordHash: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
        onClose();
      }
    } catch (err) {
      setError("Произошла ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-3 w-full">
        <Input
          isRequired
          label="Имя"
          placeholder="Иван"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          startContent={<UserIcon className="w-4 h-4 text-gray-400" />}
        />
        <Input
          isRequired
          label="Фамилия"
          placeholder="Петров"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
      </div>

      <Input
        isRequired
        type="email"
        label="Email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        startContent={<EnvelopeIcon className="w-4 h-4 text-gray-400" />}
      />

      <Input
        isRequired
        type="password"
        label="Пароль"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        startContent={<LockClosedIcon className="w-4 h-4 text-gray-400" />}
        description="Минимум 6 символов"
      />

      <Input
        isRequired
        type="password"
        label="Подтвердите пароль"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>

        <Button type="button" variant="light" onPress={onClose} className="w-full">
          Отмена
        </Button>

        <div className="text-center text-sm mt-2">
          <span className="text-gray-500">Уже есть аккаунт? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium hover:underline"
            style={{ color: "#2A9D8F" }}
          >
            Войти
          </button>
        </div>
      </div>
    </Form>
  );
}