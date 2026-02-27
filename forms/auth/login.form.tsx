"use client";
import { Form, Input, Button } from "@heroui/react";
import { useState } from "react";

interface IProps {
  onClose: () => void;
}

const LoginForm = ({ onClose }: IProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <Form className="w-full max-w-xs" onSubmit={handleSubmit} validationBehavior="native">
      <Input
        isRequired
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Введите email"
        type="email"
        value={formData.email}
        // Исправлено: classNames вместо className
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none",
        }}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        validate={(value) => (!value ? "Email обязателен" : null)}
      />
      <Input
        isRequired
        label="Пароль"
        labelPlacement="outside"
        name="password"
        placeholder="Введите пароль"
        type="password"
        value={formData.password}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none",
        }}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        validate={(value) => (!value ? "Пароль обязателен" : null)}
      />
      <div className="flex w-full gap-4 items-center pt-8 justify-end">
        <Button variant="light" onPress={onClose}>
          Отмена
        </Button>
        <Button color="primary" type="submit">
          Войти
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
