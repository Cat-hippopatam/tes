"use server";

import { signIn } from '@/auth/auth';
import { AuthError } from "next-auth"; // Если используете Auth.js/NextAuth

export async function signInWithCredentials(email: string, password: string) { 
    try {
        await signIn("credentials", {
            email, 
            password,
            redirect: false
        });

        return { success: true }; // Возвращаем объект успеха
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: error.type }; // Или кастомное сообщение
        }
        // Важно вернуть объект, а не выбрасывать ошибку
        return { error: "Something went wrong" };
    }
}
