"use server";

import { IFormData } from "@/types/form-data";
import prisma from "@/utils/lib/prisma";
import { saltAndHashPassword } from "@/utils/password";

export async function registerUser(formData: IFormData) {
    const { email, passwordHash, confirmPassword, firstName, lastName} = formData;

    if (passwordHash !== confirmPassword) {
        return { error: "Пароли не совпадают" };
    }

    if (passwordHash.length < 6) {
        return { error: "Пароль должен быть не менене 6 символов"};
    }
    

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "Пользователь с таким email уже существует" };
        }
        const pwHash = await saltAndHashPassword(passwordHash);
        const user = await prisma.user.create({
        data: {
            email,
            passwordHash: pwHash,
            firstName: "test", 
            lastName: "test",
        }
    });
    
        return { success: true, user };

    } catch (error) { // Оставляем без типа или пишем (error: unknown)
    if (error instanceof Error) {
        // Теперь TS знает, что у error есть свойство message
        console.error("Ошибка регистрации:", error.message);
        
        // Проверка специфической ошибки Prisma (уникальный email)
        // if ((error as any).code === 'P2002') { 
        //     return { success: false, error: "Этот email уже занят" };
        // }
    }
    
    return { success: false, error: "Произошла непредвиденная ошибка" };
    }
}

