"use client";

import {Form, Input, Button} from "@heroui/react";
import { useState } from "react";

interface IProps {
    onClose: () => void;
}


const RegistrationForm = ({onClose}: IProps) => {

    const [formData, setFormatData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const validateEmail = (email: string) => { 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        onClose();
    };

    return (
        <Form className="w-full max-w-xs" onSubmit={handleSubmit}>
            <Input
                aria-label="Email"
                isRequired
                errorMessage="Please enter a valid email"
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Введите email"
                type="email"
                value={formData.email}
                classNames={{
                    inputWrapper: "bg-default-100",
                    input: "text-sm focus:outline-none"
                }}
                onChange={(e) => setFormatData({ ...formData, email: e.target.value})}
                validate={(value) => {
                    if (!value) return " Email обязателен";
                    if (!validateEmail(value)) return "Некорректный email";
                    return null;
                }}
            />
            <Input
                aria-label="Пароль"
                isRequired
                errorMessage="Please enter a valid password"
                label="Пароль"
                labelPlacement="outside"
                name="password"
                placeholder="Введите пароль"
                type="password"
                value={formData.password}
                classNames={{
                    inputWrapper: "bg-default-100",
                    input: "text-sm focus:outline-none"
                }}
                onChange={(e) => setFormatData({ ...formData, password: e.target.value})}
                validate={(value) => {
                    if (!value) return " Пароль обязателен";
                    if (value.length < 6) return "Пароль должен быть больше 6 символов";
                    return null;
                }}
            />
            <Input
                aria-label="Пароль"
                isRequired
                errorMessage="Please enter a valid confirm password"
                label="Пароль"
                labelPlacement="outside"
                name="password"
                placeholder="Подтвердите пароль"
                type="password"
                value={formData.confirmPassword}
                classNames={{
                    inputWrapper: "bg-default-100",
                    input: "text-sm focus:outline-none"
                }}
                onChange={(e) => setFormatData({ ...formData, confirmPassword: e.target.value})}
                validate={(value) => {
                    if (!value) return " Пароль для потдверждения обязателен";
                    if (value !== formData.password) return "Пароли должны совпадать";
                    return null;
                }}
            />
            <div className="flex w-[100%] gap-4 items-center pt-8 justify-end"> 
                <Button variant="light" onPress={onClose}>
                    Отмена
                </Button>
                <Button color="primary" type="submit">
                    Зарегистрироваться
                </Button>
            </div>
            
        </Form>
    );
}

export default RegistrationForm;