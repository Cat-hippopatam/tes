"use server";

import { IFormData } from "@/types/form-data";
import prisma from "@/utils/lib/prisma";
import { saltAndHashPassword } from "@/utils/password";

// Используем Omit, чтобы сказать TS: "Все поля из IFormData, кроме confirmPassword"
// Либо просто используйте конкретные поля, которые приходят из формы
export async function registerUser(formData: IFormData) {
    const { email, passwordHash, confirmPassword, firstName, lastName } = formData;

    // Валидация на стороне сервера (дублируем для безопасности)
    if (passwordHash !== confirmPassword) {
        return { error: "Пароли не совпадают" };
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return { error: "Пользователь уже существует" };

        const hashed = await saltAndHashPassword(passwordHash);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashed,
                firstName, // Используем реальное имя вместо "test"
                lastName,  // Используем реальную фамилию вместо "test"
            }
        });
    
        return { success: true, user };
    } catch (error) {
        console.error("Ошибка:", error);
        return { error: "Ошибка сервера" };
    }
}
