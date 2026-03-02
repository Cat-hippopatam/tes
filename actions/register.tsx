"use server";

import { IFormData } from "@/types/form-data";
import prisma from "@/utils/lib/prisma";

export async function registerUser(formData: IFormData) {
    const { email, passwordHash, confirmPassword, firstName, lastName} = formData;

    try {
        const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            firstName: "test", 
            lastName: "test",
        }
    });
    
      console.log("Пользователь успешно создан:", user.id);
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

